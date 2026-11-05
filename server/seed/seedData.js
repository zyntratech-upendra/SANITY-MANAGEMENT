const User = require('../models/User');

/**
 * Production-ready initialization
 * Ensures ONLY the primary Municipal Commissioner Admin account exists.
 * Does NOT seed any mock facilities, mock complaints, mock tasks, or mock non-admin users.
 */
const seedDatabase = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@swachh.gov.in').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      adminUser = await User.create({
        name: 'Municipal Commissioner (Admin)',
        email: adminEmail,
        password: adminPassword,
        phone: '+91 98111 00001',
        role: 'ADMIN',
        ward: 'Metropolitan Headquarters',
        createdByName: 'System Commission',
      });
      console.log(`[Init] Primary Admin user created: ${adminEmail} (Role: ADMIN)`);
    } else {
      console.log(`[Init] Primary Admin user verified: ${adminEmail} (Role: ${adminUser.role})`);
    }
  } catch (err) {
    console.error('[Init] Error verifying Admin account:', err.message);
  }
};

module.exports = { seedDatabase };
