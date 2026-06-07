/* ============================================================
   controllers/projectController.js — Project CRUD Logic
   All database operations for projects live here
   ============================================================ */

const Project = require('../models/Project');

/* ────────────────────────────────────────────────────────────
   PUBLIC ROUTES (no auth needed)
   ──────────────────────────────────────────────────────────── */

/**
 * GET /api/projects
 * Returns all projects sorted by order then newest first
 * This is what your portfolio frontend calls to load projects
 */
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project
            .find()
            .sort({ order: 1, createdAt: -1 })
            .select('-__v'); // exclude the internal __v field

        res.status(200).json(projects);

    } catch (error) {
        console.error('getAllProjects error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error. Could not fetch projects.'
        });
    }
};

/**
 * GET /api/projects/:id
 * Returns a single project by its MongoDB _id
 */
const getProjectById = async (req, res) => {
    try {
        const project = await Project
            .findById(req.params.id)
            .select('-__v');

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found.'
            });
        }

        res.status(200).json(project);

    } catch (error) {
        // Handle invalid MongoDB ID format
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid project ID format.'
            });
        }
        console.error('getProjectById error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error. Could not fetch project.'
        });
    }
};

/* ────────────────────────────────────────────────────────────
   ADMIN ROUTES (protected by auth middleware)
   ──────────────────────────────────────────────────────────── */

/**
 * POST /api/admin/projects
 * Creates a new project in MongoDB
 * Body: { title, description, techStack, liveUrl, githubUrl, tag, featured, order }
 */
const createProject = async (req, res) => {
    try {
        const {
            title,
            description,
            techStack,
            liveUrl,
            githubUrl,
            tag,
            featured,
            order
        } = req.body;

        // Basic validation
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                error: 'Title and description are required.'
            });
        }

        // If this is being set as featured, unset any existing featured project
        // (only one project can be featured at a time)
        if (featured === true) {
            await Project.updateMany({ featured: true }, { featured: false });
        }

        const project = await Project.create({
            title:       title.trim(),
            description: description.trim(),
            techStack:   Array.isArray(techStack) ? techStack : [],
            liveUrl:     liveUrl   || '',
            githubUrl:   githubUrl || '',
            tag:         tag       || 'Project',
            featured:    featured  || false,
            order:       order     ?? 0
        });

        res.status(201).json({
            success: true,
            message: 'Project created successfully.',
            project
        });

    } catch (error) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        console.error('createProject error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error. Could not create project.'
        });
    }
};

/**
 * PUT /api/admin/projects/:id
 * Updates an existing project by its MongoDB _id
 * Body: any fields you want to update (partial updates supported)
 */
const updateProject = async (req, res) => {
    try {
        const {
            title,
            description,
            techStack,
            liveUrl,
            githubUrl,
            tag,
            featured,
            order
        } = req.body;

        // If setting this project as featured, unset all others first
        if (featured === true) {
            await Project.updateMany(
                { featured: true, _id: { $ne: req.params.id } },
                { featured: false }
            );
        }

        // Build update object with only the fields that were provided
        const updateData = {};
        if (title       !== undefined) updateData.title       = title.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (techStack   !== undefined) updateData.techStack   = Array.isArray(techStack) ? techStack : [];
        if (liveUrl     !== undefined) updateData.liveUrl     = liveUrl;
        if (githubUrl   !== undefined) updateData.githubUrl   = githubUrl;
        if (tag         !== undefined) updateData.tag         = tag;
        if (featured    !== undefined) updateData.featured    = featured;
        if (order       !== undefined) updateData.order       = order;

        const project = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new:          true,  // return the updated document
                runValidators: true  // run schema validations on update
            }
        ).select('-__v');

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Project updated successfully.',
            project
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid project ID format.'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        console.error('updateProject error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error. Could not update project.'
        });
    }
};

/**
 * DELETE /api/admin/projects/:id
 * Permanently deletes a project from MongoDB by its _id
 */
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found.'
            });
        }

        res.status(200).json({
            success: true,
            message: `Project "${project.title}" deleted successfully.`
        });

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                error: 'Invalid project ID format.'
            });
        }
        console.error('deleteProject error:', error.message);
        res.status(500).json({
            success: false,
            error: 'Server error. Could not delete project.'
        });
    }
};

/* ────────────────────────────────────────────────────────────
   EXPORTS
   ──────────────────────────────────────────────────────────── */
module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
