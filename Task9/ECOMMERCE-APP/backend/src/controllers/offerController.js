const Offer = require('../models/Offer');

//Create a new Offer
//@route POST /api/offers
//@access Private/Admin
const createOffer = async (req, res) => {
    try {
        console.log('Received Offer Payload:', req.body);

        const {
            name,
            discountPercentage,
            startDate,
            endDate,
            products,
            isAppliesToAll,
            status,
            bannerImage
        } = req.body;

        const offer = new Offer({
            name,
            discountPercentage,
            startDate,
            endDate,
            products,
            isAppliesToAll,
            status,
            bannerImage
        });

        const createdOffer = await offer.save();
        res.status(201).json(createdOffer);
    } catch (error) {
        console.error('Error Creating Offer:', error); 
        res.status(500).json({ message: error.message });
    }
};

// get all offers
//@route GET /api/offers
//@access Private/Admin
const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({}).sort({ createdAt: -1 });

        // Check for expired offers and update their status
        const now = new Date();
        const updatedOffers = await Promise.all(offers.map(async (offer) => {
            if (offer.status && new Date(offer.endDate) < now) {
                offer.status = false;
                await offer.save();
            }
            return offer;
        }));

        res.json(updatedOffers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get single offer by id
//@route GET /api/offers/:id
//@access Private/Admin
const getOfferById = async (req, res) => {
    try {
        const offers = await Offer.findById(req.params.id);
        if (offers) {
            res.json(offers);
        } else {
            res.status(404).json({ message: "Offer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update offer
//@route PUT /api/offers/:id
//@access Private/Admin
const updateOffer = async (req, res) => {
    try {
        console.log('Update Request ID:', req.params.id); // Debug Log
        console.log('Update Payload:', req.body); // Debug Log
        const offer = await Offer.findById(req.params.id);

        if (offer) {
            offer.name = req.body.name || offer.name;
            offer.discountPercentage = req.body.discountPercentage || offer.discountPercentage;
            offer.startDate = req.body.startDate || offer.startDate;
            offer.endDate = req.body.endDate || offer.endDate;
            offer.products = req.body.products || offer.products;

            if (req.body.isAppliesToAll !== undefined) {
                offer.isAppliesToAll = req.body.isAppliesToAll;
            }
            if (req.body.status !== undefined) {
                offer.status = req.body.status;
            }
            if (req.body.bannerImage) {
                offer.bannerImage = req.body.bannerImage;
            }

            console.log('Offer object before save:', offer); // Debug Log

            const updateOffer = await offer.save();
            console.log('Offer updated successfully:', updateOffer); // Debug Log
            res.json(updateOffer);
        } else {
            res.status(400).json({ message: "Offer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//delete offer
//@route DELETE /api/offers/:id
//@access Private/Admin
const deleteOffer = async (req, res) => {
    try {
        const offer = await Offer.findById(req.params.id);
        if (offer) {
            await Offer.deleteOne({ _id: req.params.id });
            res.json({ message: "Offer removed" })
        } else {
            res.status(400).json({ message: "Offer not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOffers, getOfferById, createOffer, updateOffer, deleteOffer };