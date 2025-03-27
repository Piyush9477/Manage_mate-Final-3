import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!formData.name && !formData.password) {
      setMessage("Please provide at least one field to update.");
      return;
    }

    try {
      const response = await updateProfile(formData);
      if (response.success) {
        setMessage("Profile updated successfully.");
        setTimeout(() => {
          setIsEditing(false);
          setFormData({ name: "", password: "" });
        }, 1000);
      } else {
        setMessage(response.message || "Failed to update profile.");
      }
    } catch (error) {
      setMessage("Error updating profile.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Profile</h2>

        {profile ? (
          <div className="text-gray-800">
            <p className="mb-2">
              <span className="font-semibold">Name:</span> {profile.name}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p className="mb-2">
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
          </div>
        ) : (
          <p className="text-red-500 text-center">No profile data available.</p>
        )}

        <button
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-500"
          onClick={() => {
            setMessage("");
            setIsEditing(true);
          }}
        >
          Edit Profile
        </button>

        <button
          className="mt-3 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white shadow-lg rounded-lg p-6 w-96">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>

            {message && <p className="text-red-500 text-sm">{message}</p>}

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="name" className="block text-sm font-medium">New Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter new name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="block text-sm font-medium">New Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="mt-2 w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}  
    </div>
  );
};

export default Profile;
