import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [meetLink, setMeetLink] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState("");
  const [authUrl, setAuthUrl] = useState("");

  const handleAuth = async () => {
    try {
      const response = await axios.get("http://localhost:5000/auth-url");
      window.location.href = response.data.authUrl;
    } catch (err) {
      console.error("Error fetching auth URL:", err);
      setError("Failed to authenticate with Google.");
    }
  };

  const createMeet = async () => {
    try {
      const startDateTime = new Date(startTime).toISOString();
      const endDateTime = new Date(endTime).toISOString();

      const response = await axios.post("http://localhost:5000/create-meet", {
        startTime: startDateTime,
        endTime: endDateTime,
        meetingType,
      });

      setMeetLink(response.data.meetLink);
      setError("");
    } catch (err) {
      console.error("Error creating Meet session:", err);
      setError("Failed to create Google Meet session. Please try again.");
      if (err.response.status === 401) {
        setAuthUrl("http://localhost:5000/auth-url");
      }
    }
  };

  return (
    <div className="container">
      <h2>Create Google Meet Session</h2>
      <label>Meeting Type:</label>
      <input
        type="text"
        value={meetingType}
        onChange={(e) => setMeetingType(e.target.value)}
      />
      <label>Start Time:</label>
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
      />
      <label>End Time:</label>
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
      />
      <button onClick={createMeet}>Create Google Meet Session</button>

      {meetLink && (
        <div>
          <p>Google Meet session created!</p>
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            Join Meet
          </a>
        </div>
      )}

      {authUrl && (
        <button onClick={handleAuth}>Authenticate with Google</button>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
