const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // get token from header
            token = req.headers.authorization.split(' ')[1];
            // console.log("Token received in middleware:", token); 

            if (!token || token === 'undefined' || token === 'null') {
                console.log("Token is invalid/undefined string");
                return res.status(401).json({ message: "Not authorized, invalid token format" });
            }

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error("JWT Verification Error:", error.message);
            // console.error("Faulty Token:", token);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as an admin" });
    }
};

module.exports = { protect, admin };