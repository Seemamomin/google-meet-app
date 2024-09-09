const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const TOKEN_PATH = "token.json";

const setStoredCredentials = () => {
  try {
    const tokenData = fs.readFileSync(TOKEN_PATH, "utf8");
    oauth2Client.setCredentials(JSON.parse(tokenData));
  } catch (err) {
    console.log("No stored tokens found.");
  }
};

app.get("/auth-url", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.json({ authUrl });
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));

    res.redirect("http://localhost:3000");
  } catch (error) {
    console.error("Error retrieving tokens:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

app.post("/create-meet", async (req, res) => {
  try {
    setStoredCredentials();

    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      console.error("OAuth2 client is not authenticated.");
      return res
        .status(401)
        .json({ message: "User not authenticated", redirect: "auth-url" });
    }

    const calendar = google.calendar({ version: "v3", auth: oauth2Client });

    const event = {
      summary: req.body.meetingType || "Meeting",
      start: {
        dateTime: req.body.startTime,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: req.body.endTime,
        timeZone: "Asia/Kolkata",
      },
      conferenceData: {
        createRequest: {
          requestId: `unique-string-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    res.json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).json({ message: "Error creating Google Meet link" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
