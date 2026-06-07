const express = require('express');

const {
getAllProjects,
getProjectById,
createProject,
updateProject,
deleteProject
} = require('../controllers/projectController');

const auth = require('../middleware/auth');

const router = express.Router();

/* ============================================================
PUBLIC ROUTES
============================================================ */

// GET all projects
router.get('/', getAllProjects);

// GET single project
router.get('/:id', getProjectById);

/* ============================================================
PROTECTED ADMIN ROUTES
============================================================ */

// CREATE project
router.post('/', auth, createProject);

// UPDATE project
router.put('/:id', auth, updateProject);

// DELETE project
router.delete('/:id', auth, deleteProject);

module.exports = router;
