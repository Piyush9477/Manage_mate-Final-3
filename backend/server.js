require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const taskRoutes = require("./src/routes/taskRoutes");
const messageRoutes = require("./src/routes/messageRoutes");
const meetingRoutes = require("./src/routes/meetingRoutes");  
const dashboardRoutes = require('./src/routes/dashboard');
const Message = require("./src/models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:5173" } });


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/project", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/messages", messageRoutes);
app.use("/meetings", meetingRoutes);  // ✅ Added Meeting Routes
app.use('/dashboard', dashboardRoutes);
app.use("/uploads", express.static("uploads"));

const activeUsers = new Map();

io.on("connection", (socket) => {
    console.log(`✅ User connected (Socket ID: ${socket.id})`);

    socket.on("userConnected", (userId) => {
        activeUsers.set(userId, socket.id);
    });

    // ✅ Handle Meeting Notifications
    socket.on("meetingScheduled", (meetingData) => {
        console.log("📅 New Meeting Scheduled:", meetingData.meeting.title);
        io.emit("meetingNotification", meetingData); // ✅ Notify all users
    });

    socket.on("sendMessage", async ({ sender, receiver, message }) => {
        try {
            const newMessage = new Message({ sender, receiver, message, isRead: false });
            await newMessage.save();

            const savedMessage = await Message.findById(newMessage._id).populate("sender receiver", "name _id");

            const receiverSocket = activeUsers.get(receiver);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", savedMessage);
            }

            const senderSocket = activeUsers.get(sender);
            if (senderSocket) {
                io.to(senderSocket).emit("receiveMessage", savedMessage);
            }
        } catch (error) {
            console.error("❌ Message saving error:", error);
        }
    });

    socket.on("disconnect", () => {
        activeUsers.forEach((socketId, userId) => {
            if (socketId === socket.id) activeUsers.delete(userId);
        });
    });
});

// ✅ Pass WebSocket instance to app
app.set("io", io);

const PORT = process.env.PORT || 5001;
connectDB();
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
