const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  scheduledTime: { 
    type: Date, 
    required: true,
    validate: {
      validator: function(value) {
        return value > new Date(); // ✅ Prevents past dates
      },
      message: "Scheduled time must be in the future"
    }
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true // ✅ Ensure meetings always have at least one participant
  }],
  zoomMeetingId: { type: String, required: true },
  zoomJoinLink: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Meeting", MeetingSchema);
