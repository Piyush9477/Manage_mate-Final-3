import { Link } from "react-router-dom";

const Projects = ({ projects }) => {
  return (
    <div className="p-8 ml-64 text-white">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>

      {/* <Link to="/add-project" className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 mb-4 inline-block">
        + Add Project
      </Link> */}

      {/* Button to Open Add Project Modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-700 mb-4 inline-block"
      >
        + Add Project
      </button>

      {/* Add Project Modal */}
      <AddProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {projects.length === 0 ? (
        <p className="text-gray-400">No projects added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <p className="text-gray-300">{project.description}</p>
              <p className="text-sm">Assigned to: {project.assignedTo}</p>
              <p className="text-sm">Deadline: {project.deadline}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
