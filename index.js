const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');

const mongoURI = 'mongodb://148.230.97.226:27017/k23-ecom';
mongoose.connect(mongoURI).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.log(err);
});

app.use(bodyParser.json());
const corsOptions = {
    origin: [
        'https://your-vercel-app.vercel.app', // Thay bằng domain Vercel thực của bạn
        'http://localhost:3000', // Cho development
        'https://ananan.click' // Domain backend của bạn
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to K23-ECOM');
});

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
})

const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

app.post('/products', async (req, res) => {
    const { name, price, description } = req.body;
    try {
        const newProduct = new Product({ name, price, description });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
})

app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});
    
app.listen(5050, () => {
    console.log('Server is running on port 5050');
});
