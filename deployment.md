# 🚀 Deployment Guide

![Platform](https://img.shields.io/badge/Platform-Railway%20%7C%20Render-blue.svg)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)
![Status](https://img.shields.io/badge/Status-Stable-success.svg)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

<br />

> **Production Setup Strategy**
>
> Step-by-step instructions for moving the Student Hub from a local development environment to a globally accessible cloud platform.

---

## 📋 Environment Checklist

Ensure these variables are configured in your cloud provider's dashboard before initiating a build. These keys are critical for session security and database connectivity.

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/studenthub
SESSION_SECRET=a_long_random_string_for_security
```

---

## ☁️ Hosting Providers

### 1. Railway (Recommended)

Railway offers seamless integration for Node.js applications with a "set it and forget it" workflow.

1. **Connect GitHub:** Link your repository to a "New Project" in the Railway dashboard.
2. **Dynamic Port:** Railway automatically injects the `PORT` variable. Ensure `app.js` listens to `process.env.PORT`.
3. **Variables:** Manually add your `MONGODB_URI` and `SESSION_SECRET` in the **Variables** tab.

### 2. Render

Render is a powerful alternative for web services with automated CI/CD.

1. **New Web Service:** Select "New +" and connect the `StudentHub` repo.
2. **Build Command:** Use `npm install`.
3. **Start Command:** Use `node app.js`.
4. **Advanced:** Add your `.env` variables and point the health check to the root `/` path.

---

## 💾 Database Configuration

To connect your production application to **MongoDB Atlas**, follow these steps:

* **Network Access:** In your Atlas dashboard, whitelist the IP `0.0.0.0/0` to allow the cloud host to connect.
* **Database User:** Create a user with `readWrite` permissions specifically for the `studenthub` database.
* **URI Format:** Use the `mongodb+srv://` connection string provided in the "Connect" tab of your Atlas cluster.

---

## 🛠️ Troubleshooting

If the application fails to start or behavior is inconsistent in production, check these common points:

| Symptom | Likely Cause | Solution |
| --- | --- | --- |
| **Login fails instantly** | Session Storage | Verify `connect-mongo` is correctly pointing to the cloud DB. |
| **502 Bad Gateway** | Start Command | Ensure the Start Command in Render matches your entry file (`app.js`). |
| **Images disappear** | Ephemeral Storage | Cloud hosts wipe local files on restart. Integrate **Cloudinary** for persistent uploads. |
| **403 Forbidden** | IP Whitelisting | Confirm that MongoDB Atlas allows connections from all IPs (`0.0.0.0/0`). |

---

## 📜 License

Distributed under the **ISC License**. See the `LICENSE` file in the root directory for more information.
