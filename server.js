const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const fs = require("fs").promises;

const app = express();

app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (e.g., index.html)

// Load OAuth 2.0 credentials
const credentialsPath = path.join(__dirname, "client_secret_2958804837-f0mdgvkcs9732h10h346jikht98m82n6.apps.googleusercontent.com.json");
const credentials = require(credentialsPath).web;

const CLIENT_ID = credentials.client_id;
const CLIENT_SECRET = credentials.client_secret;
const REDIRECT_URI = credentials.redirect_uris[0];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const TOKEN_PATH = path.join(__dirname, "tokens.json");

// Load tokens from file
async function loadTokens() {
  try {
    const tokensData = await fs.readFile(TOKEN_PATH, "utf8");
    return JSON.parse(tokensData);
  } catch (error) {
    return {};
  }
}

// Save tokens to file
async function saveTokens(tokens) {
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));
}

// Serve index.html for root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Generate OAuth 2.0 auth URL
app.get("/authUrl", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ],
  });
  res.json({ url });
});

// Handle OAuth 2.0 callback
app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;

    const tokensStore = await loadTokens();
    tokensStore[email] = tokens;
    await saveTokens(tokensStore);

    res.redirect(`/?email=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Authentication failed. Check console for details.");
  }
});

// Scan spam emails
app.get("/api/scan", async (req, res) => {
  const email = req.query.email;
  try {
    const tokensStore = await loadTokens();
    if (!email || !tokensStore[email]) {
      return res.status(401).json({ error: "Not authenticated. Please log in." });
    }

    oauth2Client.setCredentials(tokensStore[email]);
    if (tokensStore[email].expiry_date && tokensStore[email].expiry_date <= Date.now()) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        tokensStore[email] = { ...tokensStore[email], ...credentials };
        await saveTokens(tokensStore);
        oauth2Client.setCredentials(credentials);
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        return res.status(401).json({ error: "Session expired. Please re-authenticate." });
      }
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const labelRes = await gmail.users.labels.get({
      userId: "me",
      id: "SPAM",
    });
    const spamCount = labelRes.data.messagesTotal || 0;

    const spamList = await gmail.users.messages.list({
      userId: "me",
      q: "in:spam",
      maxResults: 10,
    });

    const messages = spamList.data.messages || [];

    const details = await Promise.all(
      messages.map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: "me",
          id: m.id,
          format: "metadata",
          metadataHeaders: ["From", "Subject"],
        });
        const headers = msg.data.payload.headers;
        const from = headers.find((h) => h.name === "From")?.value || "Unknown";
        const subject = headers.find((h) => h.name === "Subject")?.value || "No Subject";
        return { id: m.id, from, subject };
      })
    );

    res.json({ spamCount, messages: details });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).json({ error: "Failed to scan emails. Check console for details." });
  }
});

// Delete spam email
app.post("/api/delete", async (req, res) => {
  const { id, email } = req.body;
  try {
    const tokensStore = await loadTokens();
    if (!email || !tokensStore[email]) {
      return res.status(401).json({ error: "Not authenticated. Please log in." });
    }

    oauth2Client.setCredentials(tokensStore[email]);
    if (tokensStore[email].expiry_date && tokensStore[email].expiry_date <= Date.now()) {
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        tokensStore[email] = { ...tokensStore[email], ...credentials };
        await saveTokens(tokensStore);
        oauth2Client.setCredentials(credentials);
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        return res.status(401).json({ error: "Session expired. Please re-authenticate." });
      }
    }

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    await gmail.users.messages.trash({ userId: "me", id });
    res.json({ deleted: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete email." });
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));