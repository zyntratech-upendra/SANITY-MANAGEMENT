# SWACHH-SMART: Smart Sanitation & Public Toilet Monitoring System

An enterprise-grade, real-time public sanitation monitoring and automated maintenance platform built for municipal corporations and smart city authorities.

## 🏛️ Problem Addressed
Municipal officials frequently face blind spots regarding public sanitation infrastructure:
- Lack of visibility into which public toilets are available, occupied, or out of order.
- Inability to quickly detect which facilities require urgent cleaning or plumbing maintenance.
- Slow or missing feedback loops between citizens, visitors, and field sanitation teams.
- Lack of automated incident dispatch and duration tracking for cleaning staff.

---

## 💡 System Solution & Capabilities

1. **Facility Registry & GIS Mapping**:
   - Register all municipal public toilet complexes with unique facility identifiers (`TOILET-101`, `TOILET-102`, etc.).
   - Interactive GIS OpenStreetMap (Leaflet) with color-coded status pins:
     - 🟢 **Available & 5★ Clean**
     - 🔵 **Occupied / In-Use**
     - 🟡 **Cleaning In Progress / Needs Attention**
     - 🔴 **Maintenance Required / Critical Sensor Alert**

2. **Automated QR Code Citizen Portal**:
   - Dynamic high-resolution QR code generator for every registered facility.
   - Printable official municipal signage placards with quick-scan feedback instructions.
   - Mobile-responsive visitor feedback interface:
     - 1 to 5 Star Cleanliness Rating
     - Multi-select problem checklist (Foul Odor, No Water, Clogged Flush, Empty Soap, Dirty Floors, Broken Locks, Litter Overflow)
     - Optional citizen contact for real-time tracking receipt.

3. **Intelligent Automated Task Dispatch**:
   - When a citizen scans and reports an unclean toilet or urgent issue (e.g., rating ≤ 2, No Water, Foul Odor), the system:
     - Automatically changes facility status to **Critical / Needs Attention**.
     - Generates a tracking Ticket ID (`TKT-755110`).
     - Automatically creates a maintenance task (`TSK-9803`) with **URGENT** priority.
     - Auto-dispatches the task to the assigned on-duty field sanitation specialist.
     - Broadcasts real-time visual alerts over WebSockets to the Municipal Command Center.

4. **Sanitation Staff Mobile Duty & Completion Tracker**:
   - Dedicated Sanitation Worker mobile terminal with staff switcher (Rajesh Kumar, Sunita Devi, Amit Patel, Deepa Verma).
   - Live Stopwatch timer to track exact cleaning start and completion duration (minutes).
   - Interactive 5-point sanitation checklist (Floors scrubbed, bowls disinfected, soap refilled, water flow verified, odor neutralized).
   - Single-click "Complete Cleaning & Mark Clean" button:
     - Restores facility availability to `AVAILABLE` and cleanliness to `EXCELLENT`.
     - Automatically resolves the citizen complaint ticket.
     - Updates the staff performance leaderboard and SLA metrics.

5. **IoT Multi-Sensor Telemetry & Hardware Simulator**:
   - Real-time telemetry monitoring for:
     - **Water Reservoir Level (%)**: Automatic alert and emergency plumbing task if tank drops below 20%.
     - **Ammonia / Odor Air Quality (PPM)**: Automatic cleaning dispatch if odor crosses 45 PPM.
     - **Touchless Dispenser Fluid (%)**: Automatic consumable refill task if soap drops below 15%.
     - **Smart Stall Occupancy Sensor**: Live Occupied vs. Vacant indicator.
     - **Footfall Counter**: Daily citizen usage traffic.
   - Interactive Hardware Simulator panel allowing municipal supervisors to test sensor anomalies live.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Leaflet GIS Maps, Socket.io Client, Canvas Confetti.
- **Backend**: Node.js, Express.js, Socket.IO (bidirectional WebSocket telemetry), QRCode generator.
- **Database**: MongoDB (Mongoose models) with auto-detect fallback to high-availability persistent storage, ensuring zero-setup instant execution out-of-the-box.
- **Environment**: `.env` configuration for ports and API endpoints.

---

## 🚀 Running the Application

### 1. Backend Server
```bash
cd server
npm install
npm start
# Server runs on http://localhost:5000
# WebSocket stream: ws://localhost:5000
```

### 2. Frontend Client
```bash
cd client
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🌐 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service online health & uptime check |
| `GET` | `/api/facilities` | List all public toilets (filter by zone & status) |
| `GET` | `/api/facilities/:idOrCode` | Get facility by unique ID or code |
| `POST` | `/api/facilities` | Register new facility & auto-generate QR code |
| `PATCH` | `/api/facilities/:id/staff-status` | Worker updates cleanliness & availability |
| `POST` | `/api/complaints` | Citizen submits report -> auto-dispatches task |
| `GET` | `/api/complaints` | List citizen complaints |
| `PATCH` | `/api/complaints/:id/resolve` | Mark complaint resolved with notes |
| `GET` | `/api/tasks` | List maintenance tasks & track completion duration |
| `PATCH` | `/api/tasks/:id/start` | Worker starts cleaning timer |
| `PATCH` | `/api/tasks/:id/complete` | Worker completes cleaning & marks clean |
| `GET` | `/api/staff` | Staff roster & performance leaderboard |
| `POST` | `/api/telemetry/update/:id` | Update IoT sensor readings & check thresholds |
| `POST` | `/api/telemetry/simulate` | Simulate sensor event (low water, odor spike) |

