const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    email: {
        type: String,
        required: [true, "please add an email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    phone: {
        type: String,
        required: [true, "please add a phone number"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    //otp verification
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    //forgot password
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
    ],
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);