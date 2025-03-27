import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";

const MyTasks = () => {
    const { user } = useAuth();
    const { tasks, fetchTasks } = useTask();

    useEffect(() => {
        if(user){
            fetchTasks();
        }
    }, [user]);

    return(
        <div className="p-8 ml-64 text-white">
            <h1 className="text-3xl font-bold mb-4 text-black">Tasks</h1>
            
            {tasks.length === 0 ? (
                <p className="text-gray-400">No tasks assigned yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tasks.map((task) => (
                        <div key={task._id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-semibold">{task.title}</h2>
                            <p className="text-gray-300">{task.description}</p>
                            <p className="text-sm">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
                            <p className="text-sm">Status: {task.status}</p>
                            <p className="text-sm">Progress: {task.progress}</p>

                            <Link
                                to={`/update-task/${task._id}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-yellow-700 mt-2 inline-block ml-2"
                            >
                                Update Task Progress
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyTasks;