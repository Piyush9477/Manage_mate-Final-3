const express = require("express");
const fs = require("fs"); // ✅ Import filesystem module
const { createProject, getProjects, getDetailedProjects, getProjectLeaders, updateProject } = require("../controllers/projectController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const multer = require("multer");
const path = require("path"); // multiple file upload

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// multiple file upload
// Allowed file types
const allowedExtensions = [".txt", ".doc", ".docx", ".pdf", ".csv", ".xls", ".xlsx", ".ppt", ".pptx", ".sql", ".png", ".jpg", ".jpeg"]; 

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// multiple file upload
// File filter for allowed extensions
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type."));
    }
};


const upload = multer({ 
    storage,
    fileFilter // multiple file upload 
});

router.post("/createProject", authMiddleware, upload.array("files", 10), createProject);  // multiple file upload
router.get("/", authMiddleware, getProjects);
router.get("/details/:projectId", authMiddleware, getDetailedProjects);
router.get("/leaders", authMiddleware, getProjectLeaders);
// router.put("/updateProject/:id", authMiddleware, updateProject);
router.put("/updateProject/:id", authMiddleware, upload.array("files", 10), updateProject);


module.exports = router;

