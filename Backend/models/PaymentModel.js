const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'UsedVehicle', required: true },
    billingAddress: { type: String, required: true },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
    nameOnCard: { type: String, required: true }
});

module.exports = mongoose.model('Payment', paymentSchema);
