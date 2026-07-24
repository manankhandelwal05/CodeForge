# 🚀 CodeForge

<div align="center">

### AI-Powered Online Coding Platform

Practice coding, execute code in multiple languages, get AI-powered debugging assistance, and track your coding progress—all in one place.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Redis](https://img.shields.io/badge/Redis-Cache-red?logo=redis)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black?logo=socketdotio)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-38BDF8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 📖 Overview

CodeForge is a full-stack coding platform inspired by modern online coding websites. It enables users to solve programming problems, execute code securely using Judge0, receive AI-powered debugging assistance from Google Gemini, and monitor their coding progress through a personalized dashboard.

The platform focuses on providing a seamless coding experience with secure authentication, real-time communication, and an intuitive user interface.

---

## ✨ Features

### 🔐 Authentication

* JWT Authentication
* OTP Verification
* Secure password hashing using bcrypt
* Redis-based token blacklisting

### 💻 Online Code Execution

* Multi-language support
* Judge0 API integration
* Instant execution results
* Compilation & runtime error handling

### 🤖 AI Debugger

* Google Gemini integration
* Explains compilation and logical errors
* Gives hints instead of complete solutions
* Helps improve problem-solving skills

### 📚 Coding Platform

* Solve coding problems
* Difficulty-based filtering
* Tag-based filtering
* Instant code submission

### 📈 Dashboard

* Track solved problems
* Monitor coding progress
* Personalized statistics

### ⚡ Real-Time Features

* Socket.IO integration
* Live updates
* Real-time discussions

### 🎨 Responsive UI

* Modern dark theme
* Mobile-friendly design
* Fast and intuitive interface

---

# 🛠️ Tech Stack

| Category       | Technologies                                         |
| -------------- | ---------------------------------------------------- |
| Frontend       | React.js, Vite, Tailwind CSS, DaisyUI, Redux Toolkit |
| Backend        | Node.js, Express.js                                  |
| Database       | MongoDB, Redis                                       |
| Authentication | JWT, bcrypt, OTP Verification                        |
| APIs           | Judge0 API, Google Gemini API                        |
| Real-Time      | Socket.IO                                            |

---

# 🏗️ Architecture

```text
                +----------------------+
                |      React App       |
                +----------+-----------+
                           |
                    REST APIs / Socket.IO
                           |
                +----------v-----------+
                |    Express Server    |
                +----------+-----------+
                           |
        +------------------+-------------------+
        |                  |                   |
        |                  |                   |
+-------v------+    +-------v------+   +--------v--------+
|  MongoDB     |    |    Redis     |   |    Judge0 API   |
| User & Data  |    | OTP & JWT    |   | Code Execution  |
+--------------+    +--------------+   +-----------------+
                           |
                    +------v------+
                    | Gemini API  |
                    | AI Debugger |
                    +-------------+
```

---

# 📂 Folder Structure

```text
CodeForge
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── redux
│   └── assets
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   └── utils
│
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/manankhandelwal05/CodeForge.git
```

Move into the project

```bash
cd CodeForge
```

Install backend dependencies

```bash
cd backend
npm install
```

Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=

MONGO_URI=

JWT_SECRET=

REDIS_URL=

GEMINI_API_KEY=

JUDGE0_API_KEY=
```

---

# ▶️ Run the Project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

---



# 🌟 Future Enhancements

* Coding contests
* Company-wise interview sheets
* Leaderboards
* Friend system
* Collaborative coding
* AI-generated hints
* Discussion forum
* Achievement badges

---

# 🤝 Contributing

Contributions are always welcome.

1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push the branch.
5. Open a Pull Request.

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Developer

**Manan Khandelwal**

* GitHub: https://github.com/manankhandelwal05
* LinkedIn: https://www.linkedin.com/in/manan-khandelwal-582166289/

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a Star!

</div>
