const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let isMongooseConnected = false;

const setMongooseConnected = (val) => {
  isMongooseConnected = val;
};

const getMongooseConnected = () => isMongooseConnected;

const generateId = () => {
  return '65f' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 12);
};

// Query matcher for in-memory / JSON fallback
const matchesQuery = (item, query = {}) => {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key of Object.keys(query)) {
    if (key === '$or' && Array.isArray(query.$or)) {
      const orMatched = query.$or.some((subQuery) => matchesQuery(item, subQuery));
      if (!orMatched) return false;
      continue;
    }

    const val = query[key];
    const itemVal = key.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), item);

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      if (val.$regex) {
        const regex = new RegExp(val.$regex, val.$options || 'i');
        if (!regex.test(String(itemVal || ''))) return false;
      } else if (val.$in && Array.isArray(val.$in)) {
        if (!val.$in.includes(itemVal)) return false;
      } else if (val.$gte !== undefined) {
        if (new Date(itemVal) < new Date(val.$gte)) return false;
      }
    } else {
      if (itemVal !== val) return false;
    }
  }

  return true;
};

class JsonStore {
  constructor(collectionName, schemaDefaults = {}) {
    this.name = collectionName;
    this.filePath = path.join(dataDir, `${collectionName}.json`);
    this.schemaDefaults = schemaDefaults;
    this.data = this.readData();
  }

  readData() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn(`Failed reading ${this.filePath}, resetting to empty.`, e.message);
    }
    return [];
  }

  saveData() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error(`Failed writing to ${this.filePath}`, e);
    }
  }

  createInstance(item) {
    const store = this;
    const doc = {
      _id: item._id || generateId(),
      ...store.schemaDefaults,
      ...item,
      createdAt: item.createdAt || new Date(),
      updatedAt: item.updatedAt || new Date(),
    };

    doc.save = async function () {
      const idx = store.data.findIndex((d) => String(d._id) === String(doc._id));
      doc.updatedAt = new Date();
      if (idx >= 0) {
        store.data[idx] = { ...store.data[idx], ...doc };
      } else {
        store.data.push(doc);
      }
      store.saveData();
      return doc;
    };

    doc.toObject = function () {
      return { ...doc };
    };

    return doc;
  }

  // Synchronous Query object builder that mimics Mongoose Query
  createQuery(filterFn, single = false) {
    const store = this;
    let sortObj = null;
    let limitNum = null;

    const queryObj = {
      sort(sortRule) {
        sortObj = sortRule;
        return queryObj;
      },
      limit(n) {
        limitNum = n;
        return queryObj;
      },
      then(resolve, reject) {
        try {
          let results = store.data.filter(filterFn);
          if (sortObj) {
            const [sortKey, sortDir] = Object.entries(sortObj)[0] || ['createdAt', -1];
            results.sort((a, b) => {
              const valA = sortKey.split('.').reduce((acc, p) => (acc ? acc[p] : undefined), a);
              const valB = sortKey.split('.').reduce((acc, p) => (acc ? acc[p] : undefined), b);
              if (valA < valB) return sortDir === -1 ? 1 : -1;
              if (valA > valB) return sortDir === -1 ? -1 : 1;
              return 0;
            });
          }
          if (limitNum !== null) {
            results = results.slice(0, limitNum);
          }
          if (single) {
            const singleItem = results[0] ? store.createInstance(results[0]) : null;
            return Promise.resolve(singleItem).then(resolve, reject);
          }
          const instanceList = results.map((d) => store.createInstance(d));
          return Promise.resolve(instanceList).then(resolve, reject);
        } catch (err) {
          return Promise.reject(err).catch(reject);
        }
      },
      catch(reject) {
        return queryObj.then(null, reject);
      },
    };

    return queryObj;
  }

  find(query = {}) {
    return this.createQuery((item) => matchesQuery(item, query), false);
  }

  findOne(query = {}) {
    return this.createQuery((item) => matchesQuery(item, query), true);
  }

  findById(id) {
    return this.createQuery((item) => String(item._id) === String(id), true);
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const idx = this.data.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...update, updatedAt: new Date() };
    this.saveData();
    return this.createInstance(this.data[idx]);
  }

  async findOneAndUpdate(query, update) {
    const idx = this.data.findIndex((d) => matchesQuery(d, query));
    if (idx === -1) return null;
    this.data[idx] = { ...this.data[idx], ...update, updatedAt: new Date() };
    this.saveData();
    return this.createInstance(this.data[idx]);
  }

  async findByIdAndDelete(id) {
    const idx = this.data.findIndex((d) => String(d._id) === String(id));
    if (idx === -1) return null;
    const removed = this.data.splice(idx, 1)[0];
    this.saveData();
    return removed;
  }

  async insertMany(docs) {
    const created = docs.map((d) => this.createInstance(d));
    this.data.push(...created);
    this.saveData();
    return created;
  }

  async countDocuments(query = {}) {
    return this.data.filter((d) => matchesQuery(d, query)).length;
  }
}

function createModelWrapper(modelName, mongooseModel, schemaDefaults = {}) {
  const jsonStore = new JsonStore(modelName.toLowerCase(), schemaDefaults);

  function ModelConstructor(data) {
    if (getMongooseConnected()) {
      return new mongooseModel(data);
    }
    return jsonStore.createInstance(data);
  }

  ModelConstructor.find = (...args) => {
    return getMongooseConnected() ? mongooseModel.find(...args) : jsonStore.find(...args);
  };

  ModelConstructor.findOne = (...args) => {
    return getMongooseConnected() ? mongooseModel.findOne(...args) : jsonStore.findOne(...args);
  };

  ModelConstructor.findById = (...args) => {
    return getMongooseConnected() ? mongooseModel.findById(...args) : jsonStore.findById(...args);
  };

  ModelConstructor.findByIdAndUpdate = (...args) => {
    return getMongooseConnected() ? mongooseModel.findByIdAndUpdate(...args) : jsonStore.findByIdAndUpdate(...args);
  };

  ModelConstructor.findOneAndUpdate = (...args) => {
    return getMongooseConnected() ? mongooseModel.findOneAndUpdate(...args) : jsonStore.findOneAndUpdate(...args);
  };

  ModelConstructor.findByIdAndDelete = (...args) => {
    return getMongooseConnected() ? mongooseModel.findByIdAndDelete(...args) : jsonStore.findByIdAndDelete(...args);
  };

  ModelConstructor.insertMany = (...args) => {
    return getMongooseConnected() ? mongooseModel.insertMany(...args) : jsonStore.insertMany(...args);
  };

  ModelConstructor.countDocuments = (...args) => {
    return getMongooseConnected() ? mongooseModel.countDocuments(...args) : jsonStore.countDocuments(...args);
  };

  return ModelConstructor;
}

module.exports = {
  setMongooseConnected,
  getMongooseConnected,
  createModelWrapper,
};
