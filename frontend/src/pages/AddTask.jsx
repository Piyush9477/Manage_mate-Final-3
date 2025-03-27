import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTask } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";

const AddTask = () => {
  const { projectId } = useParams(); // Get project ID from URL
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [success, setSuccess] = useState(false);

  const { members, loadingMembers, createTask } = useTask();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId || !taskName || !selectedMember || !deadline) {
      alert("Please fill all required fields!");
      return;
    }

    const newTask = {
      title: taskName,
      description,
      projectId,
      assignedTo: selectedMember,
      deadline: new Date(deadline).toISOString(),
    };

    const success = await createTask(newTask);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/projects");
      }, 1000);
    }
  };

  return (
    <div
      className={`p-6 max-w-lg mx-auto rounded shadow transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Create Task</h2>
      {success && <p className="text-green-500 mb-4">Task added successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium">Task Name</label>
          <input
            type="text"
            className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
              darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
            }`}
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
              darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
            }`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Assign to Member</label>
          {loadingMembers ? (
            <p>Loading members...</p>
          ) : (
            <select
              className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
                darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
              }`}
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              required
            >
              <option value="">Select Member</option>
              {members.map((member) => (
                <option key={member._id} value={member._id} className={darkMode ? "text-black" : "text-black"}>
                  {member.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Deadline</label>
          <input
            type="date"
            className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
              darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
            }`}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;
