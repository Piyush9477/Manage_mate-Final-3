import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; 
import Layout from "./components/Layout"; 
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectList from "./pages/ProjectList";
import AddProject from "./pages/AddProject";
import EditProject from './pages/EditProject';
import AddTask from './pages/AddTask';
import TaskList from "./pages/TaskList";
import EditTask from "./pages/EditTask";
import MyTasks from "./pages/MyTasks";
import UpdateTask from "./pages/UpdateTask";
import ViewTasks from "./pages/ViewTasks";
import Profile from "./pages/Profile";
import AllUsers from "./pages/AllUsers";
import DetailedProject from "./pages/DetailedProject";
import { useAuth } from "./context/AuthContext"; 
import Chat from "./components/Chat";
import MeetingList from "./pages/MeetingList";

function App() {
  const { user } = useAuth(); 
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save projects and tasks to localStorage when updated
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [projects, tasks]);

  const addProject = (newProject) => {
    setProjects([...projects, newProject]);
  };
  const updateProject = (updatedProject) => {
    setProjects(
      projects.map((project) => (project.id === updatedProject.id ? updatedProject : project))
    );
  };

  const addTask = (newTask) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = [...storedTasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const updateTask = (updatedTask) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const updatedTasks = storedTasks.filter((task) => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-users" element={<AllUsers />} />
        <Route path="/detailed-project" element={<DetailedProject />} />
        <Route path="/projects" element={user?.role ? <ProjectList projects={projects} /> : <Navigate to="/" />} />
        <Route path="/add-project" element={user?.role === "Manager" ? <AddProject addProject={addProject} /> : <Navigate to="/dashboard" />} />
        <Route path="/edit-project/:id" element={user?.role === "Manager" ? <EditProject /> : <Navigate to="/dashboard" />} />
        <Route path="/add-task/:projectId" element={user?.role === "Project Leader" ? <AddTask addTask={addTask} /> : <Navigate to="/dashboard" />} />
        <Route path="/tasks/:projectId" element={user?.role ? <TaskList deleteTask={deleteTask} /> : <Navigate to="/" />} />
        <Route path="/view-tasks" element={<ViewTasks />} />
        <Route path="/my-tasks" element = {< MyTasks />}/>
        <Route path="update-task/:taskId" element= {<UpdateTask />}/>
        <Route path="/edit-task/:taskId" element={user?.role === "Project Leader" || user?.role === "Team Member" ? <EditTask tasks={tasks} updateTask={updateTask} /> : <Navigate to="/dashboard" />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/meetings" element={<MeetingList />} />
      </Route>
    </Routes>
  );
}

export default App;
