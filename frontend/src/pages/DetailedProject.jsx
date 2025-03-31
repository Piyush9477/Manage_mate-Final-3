import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useProject } from "../context/ProjectContext";
import { useTheme } from "../context/ThemeContext";

const DetailedProject = () => {
    const { projectDetails, fetchDetailedProject } = useProject();
    const location = useLocation();
    const projectId = location.state;
    const { darkMode } = useTheme();

    useEffect(() => {
        if (projectId) {
            fetchDetailedProject(projectId);
        }
    }, [projectId]);

    if (!projectDetails.projectData) {
        return <p className={`p-8 ${darkMode ? "text-white" : "text-black"}`}>Loading project details...</p>;
    }

    const { name, description, managerId, projectLeader, deadline, status, files } = projectDetails.projectData;
    const tasks = projectDetails.taskData || [];

    return (
        <div 
            className={`p-8 ml-64 transition-all duration-300 ${
                darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
            }`}
        >
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className={`mt-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{description}</p>
            <p className="mt-2"><strong>Assigned by:</strong> {managerId?.name}</p>
            <p><strong>Assigned to:</strong> {projectLeader?.name}</p>
            <p><strong>Deadline:</strong> {new Date(deadline).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {status}</p>

            {/* Multiple File Download Links */}
            {files?.length > 0 && (
                <div className="mt-2">
                    <strong>Attachments:</strong>
                    <ul className="list-disc list-inside mt-1">
                    {files.map((file, index) => {
                        const fileName = file.split("-").slice(1).join("-"); // Extract the original filename
                        return (
                        <li key={index}>
                            <a
                            href={`http://localhost:5001${file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                            >
                            {fileName}
                            </a>
                        </li>
                        );
                    })}
                    </ul>
                </div>
            )}

            <h2 className="text-xl font-bold mt-6">Tasks</h2>
            <table className={`table-auto w-full mt-4 border-collapse border ${darkMode ? "border-gray-600" : "border-gray-300"}`}>
                <thead>
                    <tr className={`${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
                        <th className="border px-4 py-2">Title</th>
                        <th className="border px-4 py-2">Description</th>
                        <th className="border px-4 py-2">Assigned To</th>
                        <th className="border px-4 py-2">Status</th>
                        <th className="border px-4 py-2">Deadline</th>
                        <th className="border px-4 py-2">Progress</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.length > 0 ? tasks.map((task) => (
                        <tr key={task._id} className={`${darkMode ? "border-gray-600" : "border-gray-300"} border`}>
                            <td className="border px-4 py-2">{task.title}</td>
                            <td className="border px-4 py-2">{task.description}</td>
                            <td className="border px-4 py-2">{task.assignedTo?.name}</td>
                            <td className="border px-4 py-2">{task.status}</td>
                            <td className="border px-4 py-2">{new Date(task.deadline).toLocaleDateString()}</td>
                            <td className="border px-4 py-2">{task.progress}%</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4">No tasks available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DetailedProject;
