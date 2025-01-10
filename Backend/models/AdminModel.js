const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
    admin_username: {
        type: String,
        required: true,
        unique: true,
    },
    admin_email: {
        type: String,
        required: true,
        unique: true,
    },
    admin_password: {
        type: String,
        required: true,
    },
});

// Hash password before saving
adminSchema.pre('save', async function (next) {
    if (!this.isModified('admin_password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.admin_password = await bcrypt.hash(this.admin_password, salt);
    next();
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.admin_password);
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
