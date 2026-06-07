/* ============================================================
   models/Project.js — Mongoose Schema for Portfolio Projects
   Defines the shape of every project stored in MongoDB
   ============================================================ */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        // Project title — e.g. "AI Code Editor"
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },

        // Short description shown on the card
        description: {
            type: String,
            required: [true, 'Project description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters']
        },

        // Array of tech stack labels — e.g. ["React", "Node.js", "MongoDB"]
        techStack: {
            type: [String],
            default: []
        },

        // Live deployment URL
        liveUrl: {
            type: String,
            trim: true,
            default: ''
        },

        // GitHub repository URL
        githubUrl: {
            type: String,
            trim: true,
            default: ''
        },

        // Small label shown on the card — e.g. "Featured", "Portfolio", "API"
        tag: {
            type: String,
            trim: true,
            default: 'Project',
            maxlength: [30, 'Tag cannot exceed 30 characters']
        },

        // Whether this project appears in the large featured card (2-column)
        featured: {
            type: Boolean,
            default: false
        },

        // Controls display order — lower number = shown first
        order: {
            type: Number,
            default: 0
        }
    },
    {
        // Automatically adds createdAt and updatedAt timestamps
        timestamps: true
    }
);

// ── INDEX ─────────────────────────────────────────────────────
// Sort by order ascending, then by newest first as tiebreaker
projectSchema.index({ order: 1, createdAt: -1 });

// ── VIRTUAL ───────────────────────────────────────────────────
// A virtual field that returns true if the project has a live URL
projectSchema.virtual('isLive').get(function () {
    return Boolean(this.liveUrl && this.liveUrl.trim() !== '');
});

// ── MODEL ─────────────────────────────────────────────────────
// 'Project' becomes the MongoDB collection name 'projects' (auto-pluralized)
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

/* ============================================================
   SEED DATA — Your 4 Real Projects
   Used in backend/config/seed.js to pre-populate MongoDB
   ============================================================

const YOUR_PROJECTS = [
    {
        title: 'AI Code Editor',
        description: 'An AI-powered code editor that assists developers with smart suggestions and real-time code improvements. Designed with a clean, focused interface for a smooth coding experience.',
        techStack: ['JavaScript', 'AI Integration', 'Vercel'],
        liveUrl: '',         // Add your live URL here when available
        githubUrl: '',       // Add your GitHub repo URL here
        tag: 'Featured',
        featured: true,
        order: 0
    },
    {
        title: 'Cynthia AI Assistant',
        description: 'A voice-enabled AI assistant built with Python that uses speech recognition to understand and respond to user commands, automating everyday tasks intelligently.',
        techStack: ['Python', 'Speech Recognition', 'Automation'],
        liveUrl: '',         // Add your live URL here when available
        githubUrl: '',       // Add your GitHub repo URL here
        tag: 'AI',
        featured: false,
        order: 1
    },
    {
        title: 'ML Crop Yield Prediction',
        description: 'A machine learning model that predicts crop yield based on environmental and soil data. Helps farmers make data-driven decisions to improve agricultural output.',
        techStack: ['Python', 'Machine Learning', 'Data Analysis'],
        liveUrl: '',         // Add your live URL here when available
        githubUrl: '',       // Add your GitHub repo URL here
        tag: 'ML',
        featured: false,
        order: 2
    },
    {
        title: 'Personal Portfolio Website',
        description: 'A fully responsive personal portfolio site built from scratch to showcase projects, skills, and contact information. Features smooth animations and a modern dark UI.',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: '',         // Add your Vercel URL here when deployed
        githubUrl: '',       // Add your GitHub repo URL here
        tag: 'Portfolio',
        featured: false,
        order: 3
    }
];

============================================================ */
