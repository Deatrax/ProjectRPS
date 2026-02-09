const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const { uploadMaterial, getCourseMaterials, deleteMaterial } = require('../controllers/materialController');
const { protect } = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads')); 
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

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
