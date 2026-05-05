# Project RPS (Retake Prevention System)

Project RPS is an advanced, gamified academic and personal productivity system designed to help you organize courses, track tasks, and crush procrastination. It combines traditional study management tools with unique motivational mechanics (like the Pomodoro timer, achievements, and "Apology Letters" to your future self for missed deadlines).

## ✨ Features

- **Course & Sub-item Management**: Create courses, add files to them via Cloudinary, and keep all materials organized.
- **Task Tracking & TimelineView**: Track your tasks (`Exam`, `Assignment`, `Project`, etc.) with difficulties, deadlines, and a visual dashboard timeline.
- **Pomodoro Timer**: Embedded Pomodoro timer to track study sessions and accurately log effort against planned tasks.
- **Progress Tracking & Analytics**: Visualize task completion rates, effort graphs, and pain-score calculations on the dashboard and profile.
- **Gamification & Achievements**: Unlock badges, track streaks, and earn points for completing tasks on time.
- **Apology Letters**: A unique accountability feature! If you miss a deadline, the system locks you out until you write a handwritten (digital) apology letter of 50+ words to your future self, which is saved permanently to your profile.
- **Dark Mode UI**: Beautiful, vibrant, dark-themed responsive UI with smooth micro-animations.

## Image Previews:
<table>
  <tr>
    <td><img width="1470" height="796" src="https://github.com/user-attachments/assets/8c398d78-e173-4dde-b300-f99cca3ae7bf" /></td>
    <td><img width="1470" height="795" src="https://github.com/user-attachments/assets/2bea8849-aac2-41d2-9e21-ab5379da1be3" /></td>
  </tr>
  <tr>
    <td><img width="1470" height="792" src="https://github.com/user-attachments/assets/8344ab33-66a8-4802-a970-6bc4dc188c57" /></td>
    <td><img width="1470" height="793" src="https://github.com/user-attachments/assets/af025777-6e8e-45a8-a46f-56e8d69c1f09" /></td>
  </tr>
   <tr>
      <td><img width="1470" height="795" alt="Screenshot 2026-05-05 at 9 53 16 AM" src="https://github.com/user-attachments/assets/2b7b11fd-8f88-42e6-b3b5-6942804cd648" />
</td>
      <td><img width="1470" height="793" alt="Screenshot 2026-05-05 at 9 53 41 AM" src="https://github.com/user-attachments/assets/388af5ac-211d-4446-8a24-880910b2238b" />
</td>
   </tr>
</table>




## 🛠️ Technology Stack

**Frontend:**

- React 19 (via Vite)
- React Router DOM
- Axios (for API requests)
- Lucide React (for crisp SVG icons)
- Vanilla CSS (Glassmorphism & animated gradients)

**Backend:**

- Node.js & Express.js
- MongoDB & Mongoose (NoSQL Database)
- JSON Web Token (JWT) & bcryptjs (Authentication)
- Cloudinary & Multer (File uploads and media management)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas)
- Cloudinary Account (for file uploads)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/ProjectRPS.git
   cd ProjectRPS
   ```

2. **Setup the Backend Server:**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory and add the following:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Setup the Frontend Client:**

   ```bash
   cd ../client
   npm install
   ```

### Running the Application

You will need two terminal windows to run both the frontend and backend concurrently.

**Terminal 1 (Backend):**

```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd client
npm run dev
```

The frontend will typically start on `http://localhost:5173/` and the backend on `http://localhost:5000/`.

## 📁 Project Structure

```
ProjectRPS/
├── client/                 # React Frontend (Vite)
│   ├── public/
│   └── src/
│       ├── components/     # Reusable UI components (Navbar, Modals, etc.)
│       ├── context/        # React Context (AuthContext)
│       ├── pages/          # Main application views (Dashboard, Courses, Profile, etc.)
│       ├── services/       # Frontend service utilities
│       ├── App.jsx         # Main router and component tree
│       └── main.jsx        # Entry point
└── server/                 # Node.js/Express Backend
    ├── config/             # Cloudinary & database config
    ├── controllers/        # Route controllers
    ├── middleware/         # Auth & global middleware
    ├── models/             # Mongoose schemas (User, Task, Course, Material, PomodoroSession, ApologyLetter)
    ├── routes/             # Express API routes
    └── server.js           # Server entry point
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is licensed under the ISC License.
