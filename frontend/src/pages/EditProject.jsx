import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useProject();
  const [leaders, setLeaders] = useState([]);  // ✅ Define `leaders`
  
  const projectToEdit = projects.find((project) => project._id === id);
  
  if (!projects || projects.length === 0) {
    return <p className="text-red-500">Loading projects...</p>;
  }

  if (!projectToEdit) {
    return <p className="text-red-500">Project not found!</p>;
  }

  const [projectName, setProjectName] = useState(projectToEdit.name || "");
  const [description, setDescription] = useState(projectToEdit.description || "");
  const [deadline, setDeadline] = useState(
    projectToEdit.deadline ? new Date(projectToEdit.deadline).toISOString().split("T")[0] : ""
  );
  const [selectedLeader, setSelectedLeader] = useState(projectToEdit.projectLeader?._id || "");
  const [success, setSuccess] = useState(false);

  // ✅ Fetch Project Leaders
  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch("http://localhost:5001/project/leaders", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch leaders");

        const data = await response.json();
        console.log("Fetched leaders:", data);
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaders:", error.message);
      }
    };

    fetchLeaders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = { ...projectToEdit, name: projectName, description, projectLeader: selectedLeader, deadline };

    const success = await updateProject(updatedProject);
    if (success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/projects");
      }, 1000);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Project</h2>
      {success && <p className="text-green-500 mb-4">Project updated successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Project Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          <label className="block text-gray-700">Assign to Project Leader</label>
          <select
            className="w-full p-2 border rounded"
            value={selectedLeader}
            onChange={(e) => setSelectedLeader(e.target.value)}
            required
          >
            <option value="">Select Leader</option>
            {leaders.map((leader) => (
              <option key={leader._id} value={leader._id}>
                {leader.name}
              </option>
            ))}
          </select>
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
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
