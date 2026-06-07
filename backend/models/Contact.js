/* ============================================================
   models/Contact.js — Mongoose Schema for Contact Messages
   Every contact form submission is saved here in MongoDB
   ============================================================ */

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
    {
        // Sender's full name
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [100, 'Name cannot exceed 100 characters']
        },

        // Sender's email address
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            maxlength: [150, 'Email cannot exceed 150 characters'],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                'Please provide a valid email address'
            ]
        },

        // Optional subject line
        subject: {
            type: String,
            trim: true,
            default: 'No Subject',
            maxlength: [200, 'Subject cannot exceed 200 characters']
        },

        // The actual message content
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            maxlength: [2000, 'Message cannot exceed 2000 characters']
        },

        // Whether you have read/responded to this message
        // Useful for the admin dashboard to track unread messages
        isRead: {
            type: Boolean,
            default: false
        },

        // IP address of sender — useful for spam detection
        // Stored optionally, never shown publicly
        ipAddress: {
            type: String,
            default: ''
        }
    },
    {
        // Automatically adds createdAt and updatedAt timestamps
        timestamps: true
    }
);

// ── INDEX ─────────────────────────────────────────────────────
// Show newest messages first in the admin dashboard
contactSchema.index({ createdAt: -1 });

// Index on isRead so we can quickly count unread messages
contactSchema.index({ isRead: 1 });

// ── MODEL ─────────────────────────────────────────────────────
// 'Contact' becomes the MongoDB collection name 'contacts'
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
