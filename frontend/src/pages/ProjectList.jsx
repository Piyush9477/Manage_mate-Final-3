import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext"; // Import ThemeContext

const ProjectList = () => {
  const { user } = useAuth();
  const { projects, fetchProjects } = useProject();
  const { darkMode } = useTheme(); // Get darkMode state

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  return (
    <div
      className={`p-8 ml-64 transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-3xl font-bold mb-4">Projects</h1>

      {user?.role === "Manager" && (
        <Link
          to="/add-project"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 transition mb-4 inline-block"
        >
          + Add Project
        </Link>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.length === 0 ? (
          <p className={`transition-colors ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No projects assigned yet.
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className={`p-4 rounded-lg shadow-lg transition-all ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className={`transition-colors ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {project.description}
              </p>

              {user?.role === "Project Leader" ? (
                <p className="text-sm mt-2">
                  <strong>Assigned by:</strong> {project.managerId?.name}
                </p>
              ) : user?.role === "Manager" ? (
                <p className="text-sm mt-2">
                  <strong>Assigned to:</strong> {project.projectLeader?.name}
                </p>
              ) : null}

              <p className="text-sm">
                <strong>Deadline:</strong> {new Date(project.deadline).toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Status:</strong> {project.status}
              </p>

              {/* Multiple files Download Link for Project Leader */}
              {project.files?.length > 0 && (
                <div className="mt-2">
                  <strong>Attachments:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {project.files.map((file, index) => {
                      const fileName = file.split("-").slice(1).join("-"); // Extract the original filename
                      return (
                        <li key={index}>
                          <a
                            href={`http://localhost:5001${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline hover:text-blue-500 transition"
                          >
                            {fileName}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Show "Edit Project" button only for Managers */}
              {user?.role === "Manager" && (
                <Link
                  to={`/edit-project/${project._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition mt-2 inline-block"
                  onClick={() => console.log("Project ID:", project._id)}
                >
                  Edit
                </Link>
              )}

              {/* Show "Create Task" & "View Tasks" only for Team Leaders */}
              {user?.role === "Project Leader" && (
                <>
                  <Link
                    to={`/add-task/${project._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 transition mt-2 inline-block ml-2"
                  >
                    Create Task
                  </Link>
                  <Link
                    to={`/tasks/${project._id}`}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-700 transition mt-2 inline-block ml-2"
                  >
                    View Tasks
                  </Link>
                </>
              )}

              <Link
                to = "/detailed-project" state={project._id}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition mt-2 inline-block ml-2"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;
