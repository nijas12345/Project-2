# 🚀 Project Management App

A full-stack project management platform built for teams to collaborate, track productivity, and manage tasks efficiently — complete with real-time chat, video calls, time tracking, and detailed work session analytics.

## 🔧 Tech Stack

- **Frontend**: React.js + TypeScript
- **Backend**: Node.js + Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Google OAuth + JWT
- **WebSockets**: Socket.io (for real-time communication)

---

## ✨ Features

### 👥 User & Team Management
- Google Sign-In for quick and secure access
- JWT-based session management
- Role-based access control (Admin, Member, etc.)

### 📁 Project & Task Handling
- Create and manage multiple projects
- Break down projects into tasks
- Assign tasks to team members
- Track task status and deadlines

### ⏱️ Time Tracking & Productivity
- Clock In/Clock Out system
- Tea break tracking with total break time
- Daily work session logs stored in MongoDB
- Display total work time and break duration per day

### 💬 Real-Time Communication
- Team chat functionality
- Video call integration for seamless collaboration

### 📊 Dashboard & Reports
- Daily and weekly time logs per user
- Overview of productivity and work hours
- Meeting session tracking

---

## 📂 Project Structure

### Backend
backend/ │ ├── controllers/ │ └── projectController.ts ├── routes/ ├── models/ ├── Types/ │ └── express.ts ├── middlewares/ ├── utils/ └── server.ts

shell
Copy
Edit

### Frontend
frontend/ │ ├── src/ │ ├── components/ │ ├── pages/ │ ├── hooks/ │ └── App.tsx └── index.tsx

yaml
Copy
Edit

---

## 🌐 API Highlights

- `POST /api/auth/google` — Google login
- `POST /api/clock-in` — User clock-in
- `POST /api/clock-out` — User clock-out
- `POST /api/break/start` — Start break
- `POST /api/break/end` — End break
- `GET /api/work-logs/:userId` — Daily logs for a user
- `POST /api/project` — Create project
- `POST /api/task` — Create task and assign

---

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Google Developer Console credentials

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/project-management-app.git
cd project-management-app

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
Environment Variables
Create a .env file in the backend directory with the following:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
📈 Future Enhancements
Notification system for tasks and meetings

Gantt chart visualization

Admin panel for user/project control

Exportable reports (PDF/Excel)

🧠 Learning & Challenges
This app was built to apply industrial coding practices like:

Repository architecture

Type safety using TypeScript

State management and context-based auth flow

Handling real-time communication via Socket.io

Overcame hurdles with WebSocket integration and optimized MongoDB document structure for tracking daily sessions.

👤 Author
Nijas Ma — Full Stack Developer
Currently working at One.com | Passionate about building scalable, efficient systems.

📬 Contact
Feel free to reach out on LinkedIn or drop an email to your-nijasbinabbaz@gmail.com
