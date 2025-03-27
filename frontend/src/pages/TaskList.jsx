import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTask } from "../context/TaskContext";

const TaskList = () => {
  const { user } = useAuth();
  const { projectId } = useParams();
  const { tasks, fetchTasks } = useTask();
  const { projectName, fetchProjectName } = useTask();

  useEffect(() => {
    if(user){
      fetchTasks(projectId);
    }
  }, [user]);

  useEffect(() => {
    if(projectId){
      fetchProjectName(projectId);
    }
  }, [projectId]);

  return (
    <div className="p-8 ml-64 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Tasks for Project {projectName}</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-400">No tasks added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          {tasks.map(task => (
            <div key={task._id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-300">{task.description}</p>
              <p className="text-sm mt-2"><strong>Assigned to:</strong> {task.assignedTo?.name || "Unassigned"}</p>
              <p className="text-sm"><strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</p>
              <p className="text-sm"><strong>Status:</strong> {task.status}</p>
              <p className="text-sm"><strong>Progress: </strong>{task.progress}</p>

              {user.role === "Project Leader" && (
                <>
                  <Link to={`/edit-task/${task._id}`} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 mt-2 inline-block">
                    Edit Task
                  </Link>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 mt-2 inline-block ml-2"
                  >
                    Delete Task
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
