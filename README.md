
## Delivery System

A full-stack logistics management system for managing drivers, deliveries, orders, fuel tracking, and delivery efficiency analytics.  
_(still in development)_

---

### Features

Core System
- User authentication (OTP-based)
- Store & product management
- Order creation & tracking
- Delivery assignment system
- Driver & lorry management
- Fuel tracking system

Analytics
- Delivery efficiency scoring
- Average delivery time tracking
- On-time delivery rate
- Distance-based performance metrics
- Driver performance ranking (WIP)

---

### Tech Stack

Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT / OTP auth

Frontend
- React
- Axios
- Formik + Yup
- Lucide Icons

---

## Installation & Setup
1. Clone the repository and navigate to project directory:
    ```sh
    git clone https://github.com/your-username/kow-hock-delivery.git
    ```

2. Download the dependencies in package.json in both website and server:
    ```sh
    npm install
    cd server
    npm install
    ```

3. Create .env files for both frontend and backend and add required API keys.

4. Run Prisma migrations
   ```sh
    npx prisma migrate dev
    npx prisma generate
   ```

6. Start the development server on frontend
    ```sh
    cd Kow-Hock/frontend
    cd website
    npm run dev
    ```

7. In another terminal, run the backend
    ```sh
    cd Kow-Hock/backend/server
    node
    ```

### Local Development URLs
Frontend: http://localhost:5173   
Backend API: http://localhost:8000

