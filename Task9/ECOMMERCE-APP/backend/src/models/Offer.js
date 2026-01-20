const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    discountPercentage: {
        type: Number,
        required: true,
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: Boolean,
        default: true, //toggle for admin turn on and off
    },
    isAppliesToAll: {
        type: Boolean,
        required: false,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    bannerImage: {
        type: String,
    }
    },{
    timestamps: true
});

offerSchema.methods.isValid = function() {
    const now = new Date();
    return this.status && now >= this.startDate && now <= this.endDate;
};

const Offer = mongoose.model('Offer', offerSchema);
module.exports = Offer;