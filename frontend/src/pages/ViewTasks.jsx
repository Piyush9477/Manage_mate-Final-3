import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";

const ViewTasks = () => {
    const { user } = useAuth();
    const { tasksByProject, fetchTasksByProject } = useTask();

    useEffect(() => {
        if (user) {
            fetchTasksByProject();
        }
    }, [user]);

    return (
        <div className="p-6 ml-64">
            <h2 className="text-2xl font-bold mb-4">Tasks List</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tasksByProject).map(([projectId, project]) => (
                <div key={projectId} className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-lg font-bold mb-2">{project.projectName}</h3>
                    <ul className="list-disc list-inside">
                        {project.tasks.length > 0 ? (
                            project.tasks.map((task) => (
                                <li key={task._id} className="text-gray-700">
                                    {task.title} - <span className="text-sm text-gray-500">{task.status}</span>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">No tasks available</p>
                        )}
                    </ul>
                </div>
            ))}

            </div>
        </div>
    );
};

export default ViewTasks;
