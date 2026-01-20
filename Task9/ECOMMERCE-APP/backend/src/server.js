const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

//load config
dotenv.config();

//connect to database
connectDB();

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));

//default routes
app.get('/', (res) => {
    res.send('api is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);

});