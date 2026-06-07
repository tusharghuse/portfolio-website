/* ============================================================
controllers/contactController.js — Contact Form Logic
Handles contact form submissions and admin message management
============================================================ */

const Contact = require('../models/Contact');

/* ────────────────────────────────────────────────────────────
PUBLIC ROUTES
──────────────────────────────────────────────────────────── */

/**

* POST /api/contact
* Save a contact form submission
* Body: { name, email, subject, message }
  */
  const createContact = async (req, res) => {
  try {
  const {
  name,
  email,
  subject,
  message
  } = req.body;

  ```
   // Basic validation
   if (!name || !email || !message) {
       return res.status(400).json({
           success: false,
           error: 'Name, email and message are required.'
       });
   }

   const contact = await Contact.create({
       name: name.trim(),
       email: email.trim().toLowerCase(),
       subject: subject ? subject.trim() : '',
       message: message.trim()
   });

   res.status(201).json({
       success: true,
       message: 'Message sent successfully.',
       contact
   });
  ```

  } catch (error) {

  ```
   if (error.name === 'ValidationError') {
       const messages = Object.values(error.errors).map(
           err => err.message
       );

       return res.status(400).json({
           success: false,
           error: messages.join(', ')
       });
   }

   console.error('createContact error:', error.message);

   res.status(500).json({
       success: false,
       error: 'Server error. Could not send message.'
   });
  ```

  }
  };

/* ────────────────────────────────────────────────────────────
ADMIN ROUTES
──────────────────────────────────────────────────────────── */

/**

* GET /api/contact
* Return all contact messages
  */
  const getAllContacts = async (req, res) => {
  try {

  ```
   const contacts = await Contact
       .find()
       .sort({ createdAt: -1 })
       .select('-__v');

   res.status(200).json(contacts);
  ```

  } catch (error) {

  ```
   console.error('getAllContacts error:', error.message);

   res.status(500).json({
       success: false,
       error: 'Server error. Could not fetch messages.'
   });
  ```

  }
  };

/**

* DELETE /api/contact/:id
* Delete a contact message
  */
  const deleteContact = async (req, res) => {
  try {

  ```
   const contact = await Contact.findByIdAndDelete(
       req.params.id
   );

   if (!contact) {
       return res.status(404).json({
           success: false,
           error: 'Message not found.'
       });
   }

   res.status(200).json({
       success: true,
       message: 'Message deleted successfully.'
   });
  ```

  } catch (error) {

  ```
   if (error.name === 'CastError') {
       return res.status(400).json({
           success: false,
           error: 'Invalid message ID format.'
       });
   }

   console.error('deleteContact error:', error.message);

   res.status(500).json({
       success: false,
       error: 'Server error. Could not delete message.'
   });
  ```

  }
  };

/* ────────────────────────────────────────────────────────────
EXPORTS
──────────────────────────────────────────────────────────── */

module.exports = {
createContact,
getAllContacts,
deleteContact
};
