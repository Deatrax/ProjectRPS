const asyncHandler = require('express-async-handler');
const Material = require('../models/Material');
const Course = require('../models/Course');
const cloudinary = require('../utils/cloudinary'); 

const uploadMaterial = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { title, description } = req.body;


    if (!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to add material to this course');
    }

    try {
        // Convert buffer to data URI
        const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
        
        // Upload file to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `course_materials/${courseId}`, 
            resource_type: 'auto', 
            public_id: req.file.originalname.split('.')[0] + '-' + Date.now(), 
        });

        const newMaterial = await Material.create({
            title,
            description: description || '', 
            fileUrl: result.secure_url,
            publicId: result.public_id,
            course: courseId,
            user: req.user.id,
        });

        res.status(201).json(newMaterial);
    } catch (error) {
        console.error('Cloudinary upload or material save failed:', error);
        res.status(500);
        throw new Error('Material upload failed');
    }
});

const getCourseMaterials = asyncHandler(async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    if (course.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to view materials for this course');
    }

    const materials = await Material.find({ course: courseId, user: req.user.id }).sort({ createdAt: -1 });
    res.json(materials);
});

const deleteMaterial = asyncHandler(async (req, res) => {
    const { courseId, materialId } = req.params;

    const material = await Material.findById(materialId);

    if (!material) {
        res.status(404);
        throw new Error('Material not found');
    }

    if (material.course.toString() !== courseId || material.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized to delete this material');
    }

    try {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(material.publicId);

        // Delete from database
        await Material.findByIdAndDelete(materialId);

        res.json({ message: 'Material removed' });
    } catch (error) {
        console.error('Cloudinary deletion or material removal failed:', error);
        res.status(500);
        throw new Error('Material deletion failed');
    }
});

module.exports = {
    uploadMaterial,
    getCourseMaterials,
    deleteMaterial,
};
