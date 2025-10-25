const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const CLIENT_ID = "465707180682-0sjfblcnh2vb18bp2j9tr24t1ckvo9pb.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
let userTokens = {}; // Temporary memory (for testing)

app.get("/authUrl", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/gmail.modify",
      "openid",
      "email",
      "profile",
    ],
  });
  res.json({ url });
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    userTokens = tokens;
    res.redirect("/dashboard.html");
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).send("Authentication failed. Check console for details.");
  }
});

app.get("/api/scan", async (req, res) => {
  try {
    oauth2Client.setCredentials(userTokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

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
        const from = headers.find((h) => h.name === "From")?.value || "";
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        return { id: m.id, from, subject };
      })
    );

    res.json({ spamCount: details.length, messages: details });
  } catch (error) {
    console.error("Scan error:", error);
    res.status(500).send("Failed to scan emails. Check console for details.");
  }
});

app.post("/api/delete", async (req, res) => {
  try {
    oauth2Client.setCredentials(userTokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });
    const { id } = req.body;
    await gmail.users.messages.trash({ userId: "me", id });
    res.json({ deleted: true });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).send("Failed to delete email.");
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
