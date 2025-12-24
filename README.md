# 🎓 Student Hub

![Language](https://img.shields.io/badge/Language-JavaScript-yellow.svg)
![Framework](https://img.shields.io/badge/Framework-Express.js-lightgrey.svg)
![Database](https://img.shields.io/badge/Database-MongoDB-green.svg)
![Status](https://img.shields.io/badge/Status-Completed-success.svg)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

<br />

> **A Comprehensive Student Management & Directory System**
>
> Streamlining profile maintenance, directory discovery, and automated content moderation in a secure Node.js environment.

---

## 📖 About The Project

**Student Hub** is a robust web application designed to manage academic communities efficiently. It bridges the gap between students looking to showcase their profiles and administrators needing to maintain a safe, moderated environment. 

By leveraging **session-based authentication** and **MongoDB Atlas**, the platform ensures that user data is handled securely while providing a seamless user experience through dynamic **EJS templates**.

### ✨ Key Features
* **Secure Authentication:** Robust sign-up and login system using `express-session` and `connect-mongo` for persistent sessions.
* **Dynamic Student Profiles:** Students can manage their own profiles, including bio updates and secure file uploads for profile pictures and ID documents.
* **Public Student Directory:** A searchable, browsable directory to discover and connect with other students.
* **Advanced Admin Panel:** Specialized dashboard for administrators to monitor accounts, review registrations, and manage community standards.
* **Automated Content Moderation:** Custom middleware that automatically checks user-generated content against a dynamic banned words database.

---

## 🛠 Tech Stack

The project leverages a modern JavaScript stack for performance and scalability:

* **Backend:** Node.js & Express.js
* **Database:** MongoDB (Object modeling via Mongoose)
* **View Engine:** EJS (Embedded JavaScript templates)
* **File Handling:** Multer (for handling multipart/form-data)
* **Session Management:** Express-session with MongoDB storage
* **Frontend:** CSS3, Vanilla JavaScript, and EJS partials

---

## 🚀 Getting Started

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **MongoDB:** Local instance or MongoDB Atlas URI
* **npm:** Installed automatically with Node.js

### Installation

1. **Clone the repository:**
```bash
   git clone [https://github.com/MohamedKhaled217/StudentHub.git](https://github.com/MohamedKhaled217/StudentHub.git)
   cd StudentHub

```

2. **Install dependencies:**
```bash
npm install

```


3. **Environment Configuration:** Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_uri
SESSION_SECRET=your_strong_secret_key
PORT=3000

```



### Running the Application

To start the server with **nodemon** (auto-restarts on changes):

```bash
npm start

```

Once started, navigate to `http://localhost:3000` in your browser.

---

## 🌐 Deployment & Troubleshooting

### Deployment

* **Railway (Recommended):** Connect your GitHub repo, add your `.env` variables in the **Variables** tab, and Railway will automatically deploy via your `npm start` script.
* **Render:** Create a "New Web Service," connect your repo, and set the **Start Command** to `node app.js`.

### Troubleshooting

| Issue | Likely Cause | Fix |
| --- | --- | --- |
| **"Port in use"** | Hardcoded Port | Ensure `app.js` uses `process.env.PORT |
| **Missing Images** | Ephemeral Storage | Cloud hosts wipe local files on restart. Use **Cloudinary** for permanent image storage. |
| **DB Connection** | IP Whitelisting | In MongoDB Atlas, ensure you have whitelisted `0.0.0.0/0` in Network Access. |

---

## 📂 Project Structure

```text
├── 📁 config/             # Database connection and Multer setup
├── 📁 controllers/        # Logic for auth, profile, and admin routes
├── 📁 middleware/         # Auth guards and content moderation filters
├── 📁 models/             # Mongoose schemas (User, BannedWord)
├── 📁 public/             # Static assets (CSS, JS, Images, Uploads)
├── 📁 routes/             # Express route definitions
├── 📁 views/              # EJS templates and UI components
└── 📄 app.js              # Application entry point

```

---

## 👥 Team Members

**Computer and Control Dept | Port Said University**

* 👨‍💻 **Mohamed Khaled**
* 👨‍💻 **Mohamed Mousad**
* 👨‍💻 **Mohamed Eltabey**
* 👨‍💻 **Zyad Khaled**
* 👨‍💻 **Ahmed Bassem**

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
