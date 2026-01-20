
const Product = require('../models/Product');
const Offer = require('../models/Offer');

// fetch all product
// @routes GET api/products
// @access Public
const getProduct = async (req, res) => {
    try {
        //fetch products as mongoose document
        let products = await Product.find({}).lean();

        //fetch active offer
        const now = new Date();
        const activeOffers = await Offer.find({
            status: true,
            startDate: { $lte: now }
        });

        //apply discounts
        if (activeOffers.length > 0) {
            products = products.map(product => {
                let bestDiscount = 0;
                let appliedOffer = null;

                //check all active offers
                activeOffers.forEach(offer => {
                    // Adjust end date to end of day
                    const end = new Date(offer.endDate);
                    end.setHours(23, 59, 59, 999);

                    if (now > end) return; // Skip if truly expired

                    const isApplicable = offer.isAppliesToAll || offer.products.some(pId => pId.toString() === product._id.toString());

                    if (isApplicable) {
                        if (offer.discountPercentage > bestDiscount) {
                            bestDiscount = offer.discountPercentage;
                            appliedOffer = offer;
                        }
                    }
                });

                if (bestDiscount > 0) {
                    return {
                        ...product,
                        price: product.price, //original price
                        discountedPrice: Math.round(product.price * (1 - bestDiscount / 100)),
                        discountPercentage: bestDiscount,
                        activeOffers: appliedOffer.name
                    };
                }
                return product;
            });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// fetch single product
// @routes GET api/products/:id
// @access Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();//use lean to convert to plain js object
        if (product) {
            //check for active offer
            const now = new Date();
            console.log("Current Time:", now);
            const activeOffers = await Offer.find({
                status: true,
                startDate: { $lte: now }
            });
            console.log("Found Active Offers:", activeOffers.length);

            let bestDiscount = 0;
            let appliedOffer = null;

            activeOffers.forEach(offer => {
                // Adjust end date to end of day
                const end = new Date(offer.endDate);
                end.setHours(23, 59, 59, 999);

                if (now > end) return; // Skip if truly expired

                const isApplicable = offer.isAppliesToAll || offer.products.some(pId => pId.toString() === product._id.toString());

                if (isApplicable) {
                    if (offer.discountPercentage > bestDiscount) {
                        bestDiscount = offer.discountPercentage;
                        appliedOffer = offer;
                    }
                }
            });

            if (bestDiscount > 0) {
                const productWithOffer = {
                    ...product,
                    discountedPrice: Math.round(product.price * (1 - bestDiscount / 100)),
                    discountPercentage: bestDiscount,
                    activeOffers: appliedOffer.name
                };
                console.log("Final Product with Offer:", productWithOffer);
                return res.json(productWithOffer);
            }
            console.log("No offer applied to product");
            res.json(product);
            res.json(product);
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//create product
//@route POST api/products
//@access Private/Admin
const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            brand,
            category,
            countStock,
            isoutofstock,
        } = req.body;

        // req.file is added by uploadMiddleware
        let image = '';
        let gallery = [];

        if (req.files) {
            //cover image
            if (req.files['image']) {
                image = req.files['image'][0].path;// Cloudinary URL
            }
            //gallery images
            if (req.files['gallery']) {
                gallery = req.files['gallery'].map((file) => file.path);
            }
        }

        const product = new Product({
            name: name,
            price: price,
            user: req.user._id,
            image: image,
            gallery: gallery,
            brand: brand,
            category: category,
            countStock: countStock,
            isoutofstock: isoutofstock === 'true' || isoutofstock === true,
            description: description,
        });

        const createProduct = await product.save();
        res.status(201).json(createProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// update product
//@route PUT api/product/:id
//@access Private/Admin

const updateProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            brand,
            category,
            countStock,
            isoutofstock,
        } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.brand = brand || product.brand;
            product.category = category || product.category;
            product.countStock = countStock || product.countStock;

            //update image only if a new file upload
            if (req.file) {
                if (req.files['image']) {
                    product.image = req.files['image'][0].path;
                }
                //update gallery
                if (req.files['gallery']) {
                    product.gallery = req.files['gallery'].map((file) => file.path);
                }
            }

            if (isoutofstock !== undefined) {
                product.isoutofstock = isoutofstock === 'true' || isoutofstock === true;
            }

            const updateProduct = await product.save();
            res.json(updateProduct);

        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: "Product removed" });
        } else {
            res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
