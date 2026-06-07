/* Seed projects into MongoDB */

require('dotenv').config();

const connectDB = require('../config/db');
const Project = require('../models/Project');

const projects = [
    {
        title: 'Cynthia AI Assistant',
        description:
            'A Python-based voice assistant capable of executing commands, opening applications, performing web searches, and assisting with everyday productivity tasks.',
        techStack: ['Python', 'Speech Recognition', 'Automation', 'APIs'],
        liveUrl: '',
        githubUrl: '',
        tag: 'AI',
        featured: true,
        order: 1
    },
    {
        title: 'ML Crop Yield Prediction',
        description:
            'Machine Learning project that predicts crop yield using agricultural datasets and data analysis techniques to assist in farming decisions.',
        techStack: ['Python', 'Machine Learning', 'Pandas', 'Data Analysis'],
        liveUrl: '',
        githubUrl: '',
        tag: 'Machine Learning',
        featured: false,
        order: 2
    },
    {
        title: 'Personal Portfolio Website',
        description:
            'Responsive portfolio website showcasing projects, skills, education, and contact functionality with a modern user interface.',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: '',
        githubUrl: '',
        tag: 'Web Development',
        featured: false,
        order: 3
    },
    {
        title: 'AI Code Editor',
        description:
            'AI-powered code editor concept focused on improving developer productivity through intelligent assistance and streamlined coding workflows.',
        techStack: ['JavaScript', 'AI', 'Web Development'],
        liveUrl: '',
        githubUrl: '',
        tag: 'AI',
        featured: false,
        order: 4
    }
];

const seedProjects = async () => {
    try {
        await connectDB();
        await Project.deleteMany();
        console.log('Old projects removed.');
        await Project.insertMany(projects);
        console.log('Projects seeded successfully.');
        process.exit();
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedProjects();
