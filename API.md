# 🔌 Student Hub API Documentation

![Language](https://img.shields.io/badge/Language-JavaScript-yellow.svg)
![Framework](https://img.shields.io/badge/Framework-Express.js-lightgrey.svg)
![Status](https://img.shields.io/badge/Status-Stable-success.svg)

<br />

> **The Technical Core of Student Hub**
>
> A detailed reference for all RESTful endpoints, request payloads, and authorization layers.

---

## 🔐 Authentication Routes
*Public access for account creation and session entry.*

| Method | Endpoint | Description | Payload (JSON) |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/signup` | Register a new student | `{ "username", "email", "password" }` |
| **POST** | `/auth/login` | Initiate session-based login | `{ "email", "password" }` |
| **GET** | `/auth/logout` | Terminate current session | N/A |

---

## 👤 Student Profile Routes
*Requires an active session (Authenticated Students only).*

### ✨ Profile Management
* **GET** `/profile/me` : Returns the authenticated user's profile data.
* **PUT** `/profile/update` : Updates bio and personal info.
* **POST** `/profile/upload-id` : Handles multipart/form-data for ID document uploads.

### 🔍 Discovery
* **GET** `/directory` : Fetches a paginated list of public student profiles.
* **GET** `/directory/:id` : Returns public details for a specific student.

---

## 🛡️ Admin Endpoints
*Requires `isAdmin` authorization middleware.*

| Endpoint | Method | Action |
| :--- | :--- | :--- |
| `/admin/users` | **GET** | List all registered accounts and status. |
| `/admin/review/:id` | **POST** | Approve or Reject a pending registration. |
| `/admin/banned-words` | **POST** | Add a new keyword to the moderation filter. |
| `/admin/user/:id` | **DELETE** | Remove a student account from the hub. |

---

## 📊 Error Handling
The API utilizes standard HTTP status codes:
* **200/201:** Request successful.
* **401/403:** Missing or invalid credentials/permissions.
* **404:** Resource not found.
* **422:** Content moderation failed (Banned word detected).

---

## 📜 License
Distributed under the **ISC License**.
