# 🚀 CodeForge - AI Powered Coding Platform

CodeForge is a full-stack coding platform inspired by LeetCode that enables users to practice programming problems, execute code in multiple languages, receive AI-powered debugging assistance, and track their coding progress. The platform is designed to provide an interactive and modern coding experience with secure authentication and real-time features.

---

## ✨ Features

### 🔐 Authentication

* Secure JWT-based authentication
* OTP verification during registration
* Password hashing using bcrypt
* Redis-based token blacklisting for secure logout

### 💻 Online Code Execution

* Execute code in multiple programming languages
* Powered by Judge0 API
* Real-time execution results
* Compilation and runtime error handling

### 🤖 AI Debugger

* Integrated with Google Gemini AI
* Explains compilation and logical errors
* Provides hints instead of complete solutions
* Helps users understand concepts and improve problem-solving skills

### 📚 Coding Problems

* Browse coding problems by difficulty
* Filter problems using tags
* View problem descriptions, constraints, and examples
* Submit and evaluate solutions instantly

### 📊 User Dashboard

* Track solved problems
* Monitor coding progress
* View performance statistics

### ⚡ Real-Time Features

* Socket.IO powered communication
* Instant updates
* Real-time discussions

### 🎨 Modern UI

* Responsive design
* Dark theme
* Built with React.js and Tailwind CSS
* Clean and intuitive user experience

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* DaisyUI
* React Router
* Redux Toolkit
* React Hook Form
* Zod

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Redis
* Socket.IO
* JWT Authentication
* bcrypt

## APIs & AI

* Judge0 API
* Google Gemini API

---

# 📂 Project Structure

```
CodeForge/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── utils/
│
└── README.md
```

---

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/codeforge.git
cd codeforge
```

---

## Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

REDIS_URL=your_redis_url

JUDGE0_API_KEY=your_judge0_api_key

GEMINI_API_KEY=your_gemini_api_key
```

---

## Run the Application

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

---

# 📸 Screenshots

Add screenshots of:

* Home Page
* Login
* Dashboard
* Problem Page
* Code Editor
* AI Debugger

Example:

```
/screenshots/home.png
/screenshots/editor.png
/screenshots/dashboard.png
```

---

# 🌟 Future Improvements

* Coding contests
* Company-wise interview questions
* Leaderboard
* Friend system
* Collaborative coding rooms
* AI-generated coding hints
* Discussion forum
* Profile achievements and badges

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

**Manan Khandelwal**

* LinkedIn: [https://linkedin.com/in/your-linkedin](https://www.linkedin.com/in/manan-khandelwal-582166289/)

