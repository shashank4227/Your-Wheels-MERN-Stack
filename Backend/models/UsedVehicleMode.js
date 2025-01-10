const mongoose = require('mongoose');

const usedVehicleSchema = new mongoose.Schema({
    seller_username: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['Car', 'Bike'],
        required: true,
    },
    location: {
        type: String,
        enum: ['Hyderabad', 'Chennai', 'Mumbai', 'Bangalore', 'Delhi'],
        required: true,
    },
    fuelType: {
        type: String,
        enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        required: true,
    },
    seller_email: {
        type: String,
        required: true,
    },
    registrationYear: {
        type: String,
        required: true,
    },
    vehicleCompany: {
        type: String,
        required: true,
    },
    vehicleModel: {
        type: String,
        required: true,
    },
    sellingPrice: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: Number,
        required: true,
    },
    buyer_username: {
        type: String,
    },
    buyer_username: {
        type:String
    }
});

const UsedVehicle = mongoose.model('UsedVehicle', usedVehicleSchema);

module.exports = UsedVehicle;
