# 📧 SpamEmailDetection (Email Spam Detector)

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-blue?logo=express)
![GmailAPI](https://img.shields.io/badge/Gmail-API-red?logo=gmail)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

> A simple and secure web application that connects to your Gmail account, scans for spam emails, and lets you delete them easily — built with **Node.js**, **Express**, and the **Gmail API**.

---

## 🖼️ Preview

<p align="center">
  <img src="assets/dashboard-preview.png" alt="SpamEmailDetection Dashboard Preview" width="600"/>
</p>

*(Add a screenshot of your dashboard UI inside `/assets/dashboard-preview.png` to make your README look polished)*

---

## 🚀 Features

✅ **Google OAuth 2.0 Authentication** – Login securely with your Gmail account.  
✅ **Spam Detection** – Fetch spam emails from your Gmail Spam folder.  
✅ **Email Management** – Delete or review spam emails directly from the dashboard.  
✅ **Lightweight Frontend** – Simple HTML/CSS/JS interface for speed and simplicity.  
✅ **Educational Purpose** – Ideal for learning Gmail API integration.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| Backend | Node.js + Express.js |
| API | Google Gmail API |
| Authentication | OAuth 2.0 |
| Frontend | HTML, CSS, JavaScript |
| Hosting (optional) | Localhost / Render / Vercel |

---

## ⚙️ Setup and Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/SpamEmailDetection.git
cd SpamEmailDetection
````

### 2️⃣ Install Dependencies

```bash
npm install express googleapis
```

---

## 🔑 Google Cloud Setup (Gmail API)

1. Go to the **[Google Cloud Console](https://console.cloud.google.com/)**

2. Enable the **Gmail API** for your project

3. Create **OAuth 2.0 Credentials**:

   * Application type: **Web Application**
   * Name: `SpamEmailDetection`
   * Authorized redirect URI:

     ```
     http://localhost:3000/oauth2callback
     ```

4. Copy the generated **Client ID** and **Client Secret**

5. Set up your **OAuth consent screen**:

   * App type: **External**
   * Add your own Gmail under **Test Users**
   * Save and publish (you don’t need verification for test users)

---

## 🧩 Environment Variables (Optional)

Create a `.env` file to store your credentials:

```
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:3000/oauth2callback
```

In `server.js`, add:

```js
require("dotenv").config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
```

---

## 📂 File Structure

```
📦 SpamEmailDetection
 ┣ 📜 server.js
 ┣ 📜 http.html
 ┣ 📜 package.json
 ┣ 📜 README.md
 ┗ 📂 assets/
     ┗ 📸 dashboard-preview.png


## 🖥️ Run the App

```bash
node server.js


Then visit:
👉 **[http://localhost:3000](http://localhost:3000)**

Login with your **test Gmail account**, authorize the app, and view spam emails on the dashboard.



## ⚠️ Common Issues & Fixes

| Problem                                     | Cause                                              | Fix                                                            |
| ------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------- |
| `Access blocked: App has not been verified` | App uses Gmail scopes & is unverified              | Add your Gmail under **Test Users** in OAuth consent screen    |
| Redirect URI mismatch                       | Redirect URL differs from your Cloud Console setup | Ensure exact match with `http://localhost:3000/oauth2callback` |
| No emails displayed                         | Tokens missing or expired                          | Restart the server and re-authenticate                         |
| “Failed to scan emails”                     | Gmail API permission error                         | Revoke and reauthorize app access                              |


## 🔒 Privacy & Security

* The app uses **OAuth2** for secure Gmail access.
* No passwords are stored — only temporary tokens (in-memory).
* Tokens are reset each time you restart the server.
* For production, store tokens in a secure database and use HTTPS.



## 🌐 Deployment (Optional)

If you want to host this project online:

* Deploy backend on [Render](https://render.com/), [Vercel](https://vercel.com/), or [Railway](https://railway.app/)
* Update your **Redirect URI** in Google Cloud Console to match your hosted URL
  (e.g., `https://your-app-name.onrender.com/oauth2callback`)


## ⭐ Acknowledgements

* [Google APIs Node.js Client](https://github.com/googleapis/google-api-nodejs-client)
* [Gmail API Docs](https://developers.google.com/gmail/api)
* [Express.js](https://expressjs.com/)
* [Node.js](https://nodejs.org/en/)



## 🏁 License

This project is licensed under the **MIT License** — feel free to use and modify it.




