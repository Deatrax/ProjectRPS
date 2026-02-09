const Course = require('../models/Course');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ user: req.user.id });
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createCourse = async (req, res) => {
    const { name, code, description } = req.body;

    try {
        const newCourse = new Course({
            name,
            code,
            description,
            user: req.user.id,
        });

        const course = await newCourse.save();
        res.json(course);
    } catch (err) {
        console.error(err.message);
        // Check for duplicate course code
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Course with this code already exists.' });
        }
        res.status(500).send('Server Error');
    }
};

const deleteCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);

        if (!course) return res.status(404).json({ msg: 'Course not found' });

        
        if (course.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Course removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ msg: 'Course not found' });
        }

        
        if (course.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        res.json(course);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') { 
            return res.status(404).json({ msg: 'Course not found' });
        }
        res.status(500).send('Server Error');
    }
};

module.exports = {
    getCourses,
    createCourse,
    deleteCourse,
    getCourseById,
};
