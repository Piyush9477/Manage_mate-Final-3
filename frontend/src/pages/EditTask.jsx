import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditTask = ({ tasks, updateTask }) => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  // ✅ Get the task from state OR localStorage
  const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskToEdit = tasks.find((task) => task.id === Number(taskId)) ||
                     storedTasks.find((task) => task.id === Number(taskId));

  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setDescription(taskToEdit.description);
      setDeadline(taskToEdit.deadline);
      setStatus(taskToEdit.status);
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedTask = {
      ...taskToEdit,
      name: taskName,
      description,
      deadline,
      status,
    };
  
    // ✅ Fetch latest tasks from localStorage
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  
    // ✅ Update the correct task in the list
    const updatedTasks = storedTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  
    // ✅ Save updated tasks back to localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  
    // ✅ Update state to reflect changes
    updateTask(updatedTask);
  
    // ✅ Redirect back to View Tasks page
    navigate(`/tasks/${taskToEdit.projectId}`);
  };
  

  if (!taskToEdit) {
    return <p className="text-red-500 text-center">Task not found!</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Task Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            className="w-full p-2 border rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
