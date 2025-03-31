import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, updateProject } = useProject();
  const [leaders, setLeaders] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  const allowedFileTypes = [
    "text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/sql", "image/png", "image/jpeg"
  ];

  useEffect(() => {
    const projectToEdit = projects.find((project) => project._id === id);
    if (projectToEdit) {
      setProjectName(projectToEdit.name || "");
      setDescription(projectToEdit.description || "");
      setDeadline(
        projectToEdit.deadline ? new Date(projectToEdit.deadline).toISOString().split("T")[0] : ""
      );
      setSelectedLeader(projectToEdit.projectLeader?._id || "");

      if (projectToEdit.files) {
        const formattedFiles = projectToEdit.files.map((filePath) => {
          const fileName = filePath.split("/").pop().split("-").slice(1).join("-");
          return { fullPath: filePath, fileName };
        });
        setExistingFiles(formattedFiles);
      }
    }
  }, [id, projects]);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch("http://localhost:5001/project/leaders", {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch leaders");

        const data = await response.json();
        setLeaders(data);
      } catch (error) {
        console.error("Error fetching leaders:", error.message);
      }
    };

    fetchLeaders();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filteredFiles = selectedFiles.filter(file => allowedFileTypes.includes(file.type));

    if (filteredFiles.length !== selectedFiles.length) {
      alert("Some files were not accepted due to invalid file type.");
    }

    setNewFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
  };

  const removeNewFile = (index) => {
    setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProject = {
      name: projectName,
      description,
      projectLeader: selectedLeader,
      deadline,
    };

    const success = await updateProject(id, updatedProject, newFiles);
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

        {/* Existing Files Section */}
        <div className="mb-4">
          <label className="block text-gray-700">Existing Files</label>
          <div className="border rounded p-2 bg-gray-100">
            {existingFiles.length > 0 ? (
              existingFiles.map((file, index) => (
                <div key={index} className="border p-2 my-1 bg-white shadow-sm rounded">
                  <a 
                    href={`http://localhost:5001${file.fullPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.fileName}
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No files uploaded yet</p>
            )}
          </div>
        </div>

        {/* New Files Upload Section */}
        <div className="mb-4">
          <label className="block text-gray-700">Upload New Files</label>

          {/* Upload File Button (Only shown when no file is selected) */}
          {newFiles.length === 0 && (
            <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block">
              Upload File
              <input type="file" accept={allowedFileTypes.join(",")} multiple className="hidden" onChange={handleFileChange} />
            </label>
          )}

          {/* Display selected files with remove button */}
          {newFiles.length > 0 && (
            <div className="mt-2">
              <ul className="list-none">
                {newFiles.map((file, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-200 px-3 py-2 rounded mt-1">
                    <span className="text-sm">{file.name}</span>
                    <button 
                      type="button"
                      className="text-red-500 hover:text-red-700 text-lg font-bold"
                      onClick={() => removeNewFile(index)}
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add More Files Button (Shown if at least one file is selected) */}
          {newFiles.length > 0 && (
            <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-2 inline-block">
              Add More Files
              <input type="file" accept={allowedFileTypes.join(",")} multiple className="hidden" onChange={handleFileChange} />
            </label>
          )}
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Project
        </button>
      </form>
    </div>
  );
};

export default EditProject;
