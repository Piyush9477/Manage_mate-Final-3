import React, { useEffect, useState } from "react";
import socket from "../components/Socket"; // ✅ WebSocket instance
import { useAuth } from "../context/AuthContext"; // ✅ Import authentication context

const MeetingList = () => {
  const { user } = useAuth(); // ✅ Get the logged-in user
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [zoomJoinLink, setZoomJoinLink] = useState("");
  const [participants, setParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5001/meetings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        console.log("📢 Meetings fetched:", data);
        setMeetings(data);
      } catch (error) {
        console.error("❌ Error fetching meetings:", error);
      }
    };

    fetchMeetings();

    
        const fetchUsers = async () => {
          const token = localStorage.getItem("token");
          try {
            const response = await fetch("http://localhost:5001/auth/users", {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();
            setAllUsers(data.filter(user => user.role !== "Manager")); // ✅ Exclude Managers
          } catch (error) {
            console.error("❌ Error fetching users:", error);
          }
        };
      
        fetchUsers();
      
      

    // ✅ WebSocket: Update list when a new meeting is added
    socket.on("meetingNotification", (data) => {
      setMeetings((prev) => [...prev, data.meeting]);
    });

    return () => socket.off("meetingNotification");
  }, []);

  // ✅ Handle form submission
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    const formattedTime = new Date(scheduledTime).toISOString();
  
    const newMeeting = {
      title,
      scheduledTime: formattedTime,
      zoomJoinLink,
      participants // ✅ Include selected participants
    };
  
    try {
      const response = await fetch("http://localhost:5001/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newMeeting)
      });
  
      const data = await response.json();
      console.log("✅ Meeting created:", data);
      
      setMeetings((prev) => [...prev, data.meeting]);
  
      // Reset form
      setTitle("");
      setScheduledTime("");
      setZoomJoinLink("");
      setParticipants([]);
    } catch (error) {
      console.error("❌ Error creating meeting:", error);
    }
  };
  

  return (
    <div className="p-4 bg-white shadow-md rounded ml-20 md:ml-64 transition-all">
       {(user?.role === "Manager" || user?.role === "Project Leader") && (
        <>
      <h2 className="text-lg font-semibold mb-4">Schedule a New Meeting</h2>

      {/* ✅ Create Meeting Form */}
      <form onSubmit={handleCreateMeeting} className="mb-6 p-4 border rounded bg-gray-100">
        <div className="mb-2">
          <label className="block text-sm font-medium">Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
  <label className="block text-sm font-medium">Select Participants</label>
  <select
    multiple
    value={participants}
    onChange={(e) => setParticipants([...e.target.selectedOptions].map(option => option.value))}
    className="w-full p-2 border rounded"
    required
  >
    {allUsers.map(user => (
      <option key={user._id} value={user._id}>
        {user.name} ({user.role})
      </option>
    ))}
  </select>
</div>


        <div className="mb-2">
          <label className="block text-sm font-medium">Scheduled Time</label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Zoom Join Link</label>
          <input
            type="url"
            value={zoomJoinLink}
            onChange={(e) => setZoomJoinLink(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Meeting
        </button>
      </form>
      </> 
       )}

      {/* ✅ Meeting List */}
      <h2 className="text-lg font-semibold mb-2">Upcoming Meetings</h2>
      {meetings.length === 0 ? (
        <p>No scheduled meetings</p>
      ) : (
        <ul>
          {meetings.map((meeting) => (
            <li key={meeting._id} className="border-b p-2">
              <h3 className="font-bold">{meeting.title}</h3>
              {/* ✅ Fix Invalid Date issue when displaying */}
              <p>{meeting.scheduledTime ? new Date(meeting.scheduledTime).toLocaleString() : "Invalid Date"}</p>
              <a href={meeting.zoomJoinLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                Join Meeting
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MeetingList;
