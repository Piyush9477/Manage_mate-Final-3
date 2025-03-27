import { io } from "socket.io-client";

const socket = io("http://localhost:5001"); // Use the same backend URL for chat & meetings

// Listen for new meeting notifications
socket.on("meetingNotification", (data) => {
  alert(`📅 New Meeting Scheduled: ${data.meeting.title}`);
});

export default socket;
