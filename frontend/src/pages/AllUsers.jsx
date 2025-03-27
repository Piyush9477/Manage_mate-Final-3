import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const AllUsers = () => {
  const { allUser, fetchAllUsers } = useAuth();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Categorize users by role
  const managers = allUser?.filter(user => user.role === "Manager") || [];
  const projectLeaders = allUser?.filter(user => user.role === "Project Leader") || [];
  const teamMembers = allUser?.filter(user => user.role === "Team Member") || [];

  return (
    <div className="p-6 ml-64">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>

      {/* Managers */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Managers</h2>
        <ul className="border p-4 rounded bg-gray-100">
          {managers.length > 0 ? managers.map(user => (
            <li key={user._id} className="py-1">{user.name} - {user.email}</li>
          )) : <p>No managers found.</p>}
        </ul>
      </div>

      {/* Project Leaders */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Project Leaders</h2>
        <ul className="border p-4 rounded bg-gray-100">
          {projectLeaders.length > 0 ? projectLeaders.map(user => (
            <li key={user._id} className="py-1">{user.name} - {user.email}</li>
          )) : <p>No project leaders found.</p>}
        </ul>
      </div>

      {/* Team Members */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Team Members</h2>
        <ul className="border p-4 rounded bg-gray-100">
          {teamMembers.length > 0 ? teamMembers.map(user => (
            <li key={user._id} className="py-1">{user.name} - {user.email}</li>
          )) : <p>No team members found.</p>}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;
