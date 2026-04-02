# 📧 Spam Email Detection System

A secure web application that connects to your Gmail account, identifies spam emails, and allows users to review or delete them effortlessly. Built using **Node.js**, **Express.js**, and the **Gmail API**, this project demonstrates real-world API integration and authentication workflows.

---

## 🚀 Overview

Spam emails clutter inboxes and reduce productivity. This project provides a simple yet effective solution by:

* Connecting securely to Gmail using OAuth 2.0
* Fetching spam emails from the user's mailbox
* Displaying them in a clean dashboard
* Allowing users to manage (delete/review) spam efficiently

This project is ideal for learning **API integration, authentication, and backend development**.

---

## ✨ Key Features

* 🔐 **Secure Authentication**
  Google OAuth 2.0 ensures safe login without storing passwords

* 📥 **Spam Detection via Gmail API**
  Fetches emails directly from Gmail’s Spam folder

* 🧹 **Email Management**
  View and delete spam emails easily

* ⚡ **Lightweight UI**
  Fast and simple frontend using HTML, CSS, and JavaScript

* 🎯 **Educational Use Case**
  Demonstrates real-world usage of APIs and authentication systems

---

## 🧰 Tech Stack

| Layer           | Technology Used         |
| --------------- | ----------------------- |
| Backend         | Node.js, Express.js     |
| API Integration | Gmail API (Google APIs) |
| Authentication  | OAuth 2.0               |
| Frontend        | HTML, CSS, JavaScript   |
| Environment     | Node.js Runtime         |

---

## 📁 Project Structure

```
Spam-Email-Detection/
│
├── server.js              # Main backend server
├── index.html             # Frontend UI
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── .env                   # Environment variables (optional)
├── client_secret.json     # Google OAuth credentials
├── README.md              # Project documentation
└── assets/
    └── dashboard-preview.png
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/Spam-Email-Detection.git
cd Spam-Email-Detection
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

### 3️⃣ Set Up Google Cloud (Gmail API)

1. Go to: https://console.cloud.google.com/

2. Create a new project

3. Enable **Gmail API**

4. Create **OAuth 2.0 Credentials**:

   * Application Type: **Web Application**
   * Redirect URI:

     ```
     http://localhost:3000/oauth2callback
     ```

5. Download credentials and place them in your project

---

### 4️⃣ Configure Environment Variables (Recommended)

Create a `.env` file:

```
CLIENT_ID=your-client-id
CLIENT_SECRET=your-client-secret
REDIRECT_URI=http://localhost:3000/oauth2callback
```

Update `server.js`:

```js
require("dotenv").config();
```

---

## ▶️ Running the Application

Start the server:

```bash
node server.js
```

Open your browser:

```
http://localhost:3000
```

---

## 🔄 Application Workflow

1. User logs in via Google OAuth
2. App requests Gmail permissions
3. Spam emails are fetched using Gmail API
4. Emails are displayed on dashboard
5. User can delete or review emails

---

## ⚠️ Common Issues & Solutions

| Issue                 | Cause             | Solution                        |
| --------------------- | ----------------- | ------------------------------- |
| Access blocked        | App not verified  | Add Gmail to **Test Users**     |
| Redirect URI mismatch | Incorrect URI     | Match exactly in Google Console |
| Emails not loading    | Token expired     | Restart app and login again     |
| API error             | Permissions issue | Reauthorize access              |

---

## 🔒 Security Considerations

* Uses **OAuth 2.0** — no passwords stored
* Tokens are stored temporarily (in-memory)
* No persistent storage of user data
* For production:

  * Use HTTPS
  * Store tokens securely (DB)

---

## 🌐 Deployment (Optional)

You can deploy this project using:

* Render
* Railway
* Vercel (for frontend + serverless)

⚠️ Update Redirect URI after deployment:

```
https://your-app-url.com/oauth2callback
```

---

## 📌 Future Improvements

* 🔍 Add ML-based spam classification
* 📊 Email analytics dashboard
* 💾 Persistent token storage
* 📱 Responsive UI
* ⚡ Pagination for large email sets

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Acknowledgements

* Google Gmail API
* Google APIs Node.js Client
* Express.js
* Node.js

---

## 👨‍💻 Author

**Abhijit More**
Aspiring Data Engineer / Data Scientist

---

> ⭐ If you found this project useful, consider giving it a star!
