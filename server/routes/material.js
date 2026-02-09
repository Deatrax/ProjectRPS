const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadMaterial, getCourseMaterials, deleteMaterial } = require('../controllers/materialController');
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


router.post('/:courseId', protect, upload.single('materialFile'), uploadMaterial);

router.get('/:courseId', protect, getCourseMaterials);

router.delete('/:courseId/:materialId', protect, deleteMaterial);

module.exports = router;
