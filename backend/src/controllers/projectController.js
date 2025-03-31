const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");

const createProject = async (req, res) => {
    try {
        if (req.user.role !== "Manager") {
            return res.status(401).json({ message: "Access Denied. Only Managers can create projects." });
        }

        const { name, description, projectLeader, deadline } = req.body;
        const formattedDeadline = new Date(deadline);

        // multiple file upload
        const fileUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const project = new Project({
            name,
            description,
            managerId: req.user.id,
            projectLeader,
            deadline: formattedDeadline,
            files: fileUrls, // multiple file upload
        });

        await project.save();
        res.status(201).json({ message: "Project created successfully", project });
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

const getProjects = async (req, res) => {
    try {
        let projects;

        if (req.user.role === "Manager") {
            projects = await Project.find({ managerId: req.user.id })
                .populate("projectLeader", "name _id")
                .select("name description projectLeader deadline files status"); 
        } else if (req.user.role === "Project Leader") {
            projects = await Project.find({ projectLeader: req.user.id })
                .populate("managerId projectLeader", "name _id")
                .select("name description projectLeader deadline files status"); 
        } else {
            return res.status(403).json({ message: "Access Denied" });
        }

        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

const getDetailedProjects = async (req, res) => {
    try{
        if (req.user.role === "Team Member") {
            return res.status(401).json({ message: "Access Denied. Only accessible to Managers and Project Leaders." });
        }

        const {projectId} = req.params;

        const projectData = await Project.findById(projectId)
            .populate("managerId", "name")
            .populate("projectLeader", "name");

        const taskData = await Task.find({projectId})
            .populate("assignedTo", "name");

        res.status(200).json({projectData, taskData});
    }
    catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
}


const getProjectLeaders = async (req, res) => {
    try {
        if (req.user.role !== "Manager") {
            return res.status(401).json({ message: "Access Denied. Only accessible to Managers" });
        }

        const leaders = await User.find({ role: "Project Leader" }).select("name _id");
        res.json(leaders);
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};


const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, projectLeader, deadline } = req.body;

        // Find existing project
        const existingProject = await Project.findById(id);
        if (!existingProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Keep existing files and add new ones
        const existingFiles = existingProject.files || [];
        const newFiles = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const updatedProject = await Project.findByIdAndUpdate(
            id,
            {
                name,
                description,
                projectLeader,
                deadline,
                files: [...existingFiles, ...newFiles], // Append new files
            },
            { new: true }
        );

        res.json(updatedProject);
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};


module.exports = { createProject, getProjects, getDetailedProjects, getProjectLeaders, updateProject };
