import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";

const AddProject = () => {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [selectedLeader, setSelectedLeader] = useState("");
  const [files, setFiles] = useState([]); // multiple file upload
  const [success, setSuccess] = useState(false);

  const { leaders, createProject, loadingLeaders } = useProject();
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // multiple file upload
  const allowedFileTypes = [
    "text/plain", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/sql", "image/png", "image/jpeg"
  ];

  // multiple file upload
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const filteredFiles = selectedFiles.filter(file => allowedFileTypes.includes(file.type));
  
    if (filteredFiles.length !== selectedFiles.length) {
      alert("Some files were not accepted due to invalid file type.");
    }
  
    setFiles(prevFiles => [...prevFiles, ...filteredFiles]); // Append new files to existing files
  };
  
  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectName || !selectedLeader || !deadline) {
      alert("Please fill all required fields!");
      return;
    }

    const formData = new FormData();
    formData.append("name", projectName);
    formData.append("description", description || "");
    formData.append("projectLeader", selectedLeader);
    formData.append("deadline", deadline);
    // if (file) formData.append("file", file);

    // multiple file upload
    files.forEach((file) => formData.append("files", file));

    const success = await createProject(formData);
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
      <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
      {success && <p className="text-green-500 mb-4">Project added successfully!</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label className="block text-sm font-medium">Project Name</label>
          <input
            type="text"
            className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
              darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
            }`}
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          <label className="block text-sm font-medium">Assign to Project Leader</label>
          {loadingLeaders ? (
            <p>Loading leaders...</p>
          ) : (
            <select
              className={`w-full p-2 border rounded bg-transparent outline-none transition-colors ${
                darkMode ? "border-gray-700 text-white" : "border-gray-300 text-black"
              }`}
              value={selectedLeader}
              onChange={(e) => setSelectedLeader(e.target.value)}
              required
            >
              <option value="">Select Leader</option>
              {leaders.map((leader) => (
                <option key={leader._id} value={leader._id} className={darkMode ? "text-black" : "text-black"}>
                  {leader.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Upload Files</label>
          
          {/* Upload File Button (Only shown when no file is selected) */}
          {files.length === 0 && (
            <label 
              className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition inline-block"
            >
              Upload File
              <input
                type="file"
                accept={allowedFileTypes.join(",")}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}

          {/* Display selected files with remove button */}
          {files.length > 0 && (
            <div className="mt-2">
              <ul className="list-none">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center bg-gray-200 px-3 py-2 rounded mt-1">
                    <span className="text-sm">{file.name}</span>
                    <button 
                      onClick={() => handleRemoveFile(index)} 
                      className="text-red-500 hover:text-red-700 text-lg font-bold"
                    >
                      ❌
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add More Files Button (Shown if at least one file is selected) */}
          {files.length > 0 && (
            <label 
              className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mt-2 inline-block"
            >
              Add More Files
              <input
                type="file"
                accept={allowedFileTypes.join(",")}
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
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
          Add Project
        </button>
      </form>
    </div>
  );
};

export default AddProject;