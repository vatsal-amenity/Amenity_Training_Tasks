const Coupon = require("../models/Coupon");

// create a new coupon
//@route POST /api/coupons
//@access Private (Admin)
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minCartValue,
      expiryDate,
      isActive,
    } = req.body;

    const couponExists = await Coupon.findOne({ code });
    if (couponExists) {
      res.status(400).json({ message: "Coupon code already exists" });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minCartValue,
      expiryDate,
      isActive,
    });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  get all coupon
//@route GET /api/coupons
//@access Private (Admin)
const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete coupon
//@route DELETE /api/coupons
//@access Private (admin)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
      await coupon.deleteOne();
      res.json({ message: "Coupon removed" });
    } else {
      res.status(404).json({ message: "Coupon not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update coupon
//@route PUT /api/coupons
//@access Private (admin)
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if(coupon){
            coupon.code = req.body.code || coupon.code;
            coupon.discountType = req.body.discountType || coupon.discountType;
            coupon.discountValue = req.body.discountValue || coupon.discountValue;
            coupon.minCartValue = req.body.minCartValue || coupon.minCartValue;

            //active deactive coupon
            if(req.body.isActive !== undefined){
                coupon.isActive = req.body.isActive;
            }            
            if(req.body.expiryDate){
                coupon.expiryDate = req.body.expiryDate;
            }

            const updateCoupon = await coupon.save();
            res.json(updateCoupon);
        }else{
            res.status(404).json({message: "Coupon not found"});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


//verify coupon
//@route POST /api/coupons/verify
//@access Public
const verifyCoupon = async (req, res) => {
  try {
    const {code, cartTotal} = req.body;

    const coupon = await Coupon.findOne({code});

    if(!coupon){
      return res.status(404).json({message: "Invalid coupon code"});
    }

    if(!coupon.isActive){
      return res.status(400).json({message: "Coupon is inactive"});
    }

    if(new Date(coupon.expiryDate) < new Date()){
      return res.status(400).json({message: "Coupon has expired"});
    }

    if(cartTotal < coupon.minCartValue){
      return res.status(400).json({message: `Minimum cart value of ${coupon.minCartValue} requires`});
    }

    res.json({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minCartValue: coupon.minCartValue
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = {createCoupon, getCoupon, updateCoupon, deleteCoupon, verifyCoupon};
