# ExamFlow

ExamFlow is a platform for managing and conducting exams efficiently. This repository contains both the client and server components of the system.

## Setup Guide

Follow these steps to set up the ExamFlow system on your local machine.

### 1. Prerequisites

Ensure you have the following installed:

- **Git**
- **Node.js** (v18 or higher recommended)
- **Docker Desktop**

---

### 2. Clone the Repository

```bash
git clone <repository-url>
cd examflow
```

---

### 3. Database Setup (Docker)

The system uses a Postgres database running in a Docker container.

1. Open **Docker Desktop**.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Start the database:
   ```bash
   docker-compose up -d
   ```
   _Note: This starts a Postgres instance on port 5433 (mapped from 5432)._

---

### 4. Backend Configuration

1. **Environment Variables**: Create a `.env` file in the `server` directory:

   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/examflow
   PORT=5001
   ```

   > [!NOTE]
   > We use port **5001** because port 5000 is often reserved by macOS (AirPlay/Control Center).

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Prisma Synchronization**:
   Sync your database schema and generate the client:

   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. **Seed the Database**:
   Create the initial admin user:
   ```bash
   node seeds/adminSeed.js
   ```
   **Default Admin Credentials:**
   - **Email:** `admin@gmail.com`
   - **Password:** `admin123`

---

### 5. Frontend Configuration

1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```
2. **Environment Variables**: Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
3. **Install Dependencies**:

   ```bash
   npm install
   ```

---

### 6. Running the System

#### Start the Backend

In the `server` directory:

```bash
npm run dev
```

#### Start the Frontend

In the `client` directory:

```bash
npm run dev
```

The system will be available at:

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5001/api`

---

### 7. Connecting via IP Address (Other Systems)

If you want to access the system from another device on the same network:

1. **Find your Local IP**:
   - **Mac**: Check System Settings > Network > Wi-Fi > Details.
   - **Terminal**: Run `ipconfig getifaddr en0`.
     _Example IP: `192.168.1.10`_

2. **Backend Configuration (`server/.env`)**:
   Keep the `PORT=5001`. The server is already set to listen on all interfaces (`0.0.0.0`).

3. **Frontend Configuration (`client/.env.local`)**:
   Replace `localhost` with your IP:

   ```env
   NEXT_PUBLIC_API_URL=http://192.168.1.10:5001/api
   ```

4. **CORS Setup**:
   The backend is configured to allow requests from any origin (`origin: '*'`), making it easy to connect from multiple devices.

---

### Troubleshooting

- **Port Conflict**: If port 5001 is also taken, change the `PORT` in `server/.env` and `client/.env.local`.
- **Docker Issues**: Ensure Docker Desktop is running. Run `docker ps` to see if `examflow-db` is active.
- **Database Connection**: Verify your `DATABASE_URL` matches the credentials in `docker-compose.yml`.
