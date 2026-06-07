const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

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

        return res.status(201).json({ success: true, message: 'Message sent successfully.', contact });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, error: messages.join(', ') });
        }

        console.error('createContact error:', error);
        return res.status(500).json({ success: false, error: 'Server error. Could not send message.' });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 }).select('-__v');
        return res.status(200).json(contacts);
    } catch (error) {
        console.error('getAllContacts error:', error);
        return res.status(500).json({ success: false, error: 'Server error. Could not fetch messages.' });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, error: 'Message not found.' });
        }

        return res.status(200).json({ success: true, message: 'Message deleted successfully.' });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, error: 'Invalid message ID format.' });
        }

        console.error('deleteContact error:', error);
        return res.status(500).json({ success: false, error: 'Server error. Could not delete message.' });
    }
};

module.exports = { createContact, getAllContacts, deleteContact };
