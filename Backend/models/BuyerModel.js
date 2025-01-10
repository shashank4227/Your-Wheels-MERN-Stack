const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    buyer_username: {
        type: String,
        required: true,
        unique: true,
    },
    buyer_email: {
        type: String,
        required: true,
        unique: true,
    },
    buyer_password: {
        type: String,
        required: true,
    },
    isMember: {
        type: Boolean,
        default: false,
    },
   membershipType: { type: String }, // To store the type of membership
    membershipAmount: { type: Number}, // To store the membership amount
    billingAddress: { type: String }, // Store billing address
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('buyer_password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.buyer_password = await bcrypt.hash(this.buyer_password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.buyer_password);
};

const Buyer = mongoose.model('Buyer', userSchema);

module.exports = Buyer;
