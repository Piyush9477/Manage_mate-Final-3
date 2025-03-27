import { useState } from "react";

const AddProjectModal = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Project Added: ${projectName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="date"
            className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <input
            type="file"
            className="p-2 border rounded-lg"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <div className="flex justify-between mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700">
              Add Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;
