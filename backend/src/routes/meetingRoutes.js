const express = require("express");
const axios = require("axios");
const Meeting = require("../models/Meeting");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

const ZOOM_CLIENT_ID = process.env.ZOOM_CLIENT_ID;
const ZOOM_CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
const ZOOM_ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

// Function to get Zoom access token
const getZoomAccessToken = async () => {
  try {
    const response = await axios.post(
      "https://zoom.us/oauth/token",
      new URLSearchParams({
        grant_type: "account_credentials",
        account_id: ZOOM_ACCOUNT_ID
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting Zoom access token:", error.response?.data || error.message);
    throw new Error("Failed to get Zoom access token");
  }
};

// Function to get Zoom user ID
const getZoomUserId = async (accessToken) => {
  try {
    const response = await axios.get("https://api.zoom.us/v2/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response.data.id;
  } catch (error) {
    console.error("Error getting Zoom user ID:", error.response?.data || error.message);
    throw new Error("Failed to get Zoom user ID");
  }
};

// Function to create a Zoom meeting
const createZoomMeeting = async (topic, startTime) => {
  try {
    const accessToken = await getZoomAccessToken();
    const userId = await getZoomUserId(accessToken);

    const response = await axios.post(
      `https://api.zoom.us/v2/users/${userId}/meetings`,
      {
        topic,
        type: 2, // Scheduled meeting
        start_time: startTime,
        duration: 60,
        timezone: "UTC",
        settings: { host_video: true, participant_video: true }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating Zoom meeting:", error.response?.data || error.message);
    throw new Error("Failed to create Zoom meeting");
  }
};

// ✅ Schedule a meeting (Updated Route from `/schedule` to `/`)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, scheduledTime, participants } = req.body;
    const organizer = req.user.id;

    // ✅ Input validation
    if (!title || !scheduledTime || !participants.length) {
      return res.status(400).json({ message: "Title, scheduledTime, and participants are required" });
    }

    // ✅ Create Zoom meeting
    const zoomMeeting = await createZoomMeeting(title, scheduledTime);

    // ✅ Save meeting in DB
    const meeting = new Meeting({
      title,
      description,
      scheduledTime,
      organizer,
      participants, // ✅ Ensure participants are stored
      zoomMeetingId: zoomMeeting.id,
      zoomJoinLink: zoomMeeting.join_url
    });

    await meeting.save();

    // ✅ Emit WebSocket event to only the assigned users
    const io = req.app.get("io"); // Get WebSocket instance
    if (io) {
      participants.forEach((participantId) => {
        io.to(participantId).emit("meetingNotification", { meeting });
      });
    } else {
      console.warn("⚠️ WebSocket instance not found in req.app");
    }

    res.status(201).json({ message: "Meeting scheduled successfully", meeting });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ Get scheduled meetings for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ organizer: req.user.id }, { participants: req.user.id }]
    }).populate("organizer participants", "name email");

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
