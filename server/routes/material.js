const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    uploadMaterial, 
    getCourseMaterials, 
    uploadTaskMaterial, 
    getTaskMaterials, 
    deleteMaterial,
    getAllMaterials
} = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

// Configure Multer to store files in memory
const storage = multer.memoryStorage();

// Filter file types
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPEG, PNG, PDF, DOC, DOCX is allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 
    },
    fileFilter: fileFilter
});

// NOTE: Static/prefixed routes must come BEFORE wildcard routes like /:courseId
router.get('/all', protect, getAllMaterials);

// Task materials — must be before /:courseId or 'task' gets captured as a courseId
router.post('/task/:taskId', protect, upload.single('materialFile'), uploadTaskMaterial);
router.get('/task/:taskId', protect, getTaskMaterials);

// Course materials
router.post('/:courseId', protect, upload.single('materialFile'), uploadMaterial);
router.get('/:courseId', protect, getCourseMaterials);

// General delete (by material ID)
router.delete('/:materialId', protect, deleteMaterial);

module.exports = router;