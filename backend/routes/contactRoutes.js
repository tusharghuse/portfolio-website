/* ============================================================
routes/contactRoutes.js
Contact API Routes
============================================================ */

const express = require('express');

const {
createContact,
getAllContacts,
deleteContact
} = require('../controllers/contactController');

const auth = require('../middleware/auth');

const router = express.Router();

/* ============================================================
PUBLIC ROUTES
============================================================ */

/**

* POST /api/contact
* Submit contact form message
  */
  router.post('/', createContact);

/* ============================================================
PROTECTED ADMIN ROUTES
============================================================ */

/**

* GET /api/contact
* Get all contact messages
  */
  router.get('/', auth, getAllContacts);

/**

* DELETE /api/contact/:id
* Delete contact message
  */
  router.delete('/:id', auth, deleteContact);

module.exports = router;
