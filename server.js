require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const multer = require('multer');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Session Setup
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key', // Better to use environment variable
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // True in production, false in dev
    }
}));


app.use(passport.initialize());
app.use(passport.session());

// ✅ Ensure 'uploads/' folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("✅ 'uploads' folder created");
}

// ✅ MongoDB Connection
// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err.message));


// ✅ Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

// ✅ Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ✅ User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    provider: { type: String, default: 'email' },
    products: { type: Array, default: [] },
    cart: { type: Array, default: [] }
});
const User = mongoose.model('User', UserSchema);

// ✅ Google Strategy Setup
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (!user) {
            user = new User({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: '',
                provider: 'google'
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ✅ Google Auth Routes
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        req.session.user = req.user; // ✅ Session Set
        res.redirect('/index.html'); // ✅ Redirect to dashboard
    }
);

// ✅ Logout API (Google + Email Login dono ke liye)
app.get('/logout', (req, res) => {
    req.logout(() => { }); // Google Logout
    req.session.destroy(() => { // Email Login Logout
        res.redirect('/');
    });
});

// ✅ Login Status API
app.get('/auth/status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user }); // ✅ Google Login
    } else if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user }); // ✅ Email Login
    } else {
        res.json({ loggedIn: false });
    }
});

// ✅ Email Signup API
// app.post('/register', async (req, res) => {     
//     try {         
//         const { name, email, password } = req.body;                  

//         // ✅ Check if user already exists         
//         const existingUser = await User.findOne({ email });         
//         if (existingUser) {             
//             return res.status(400).json({ message: '❌ User already exists' });         
//         }          

//         // ✅ Hash Password         
//         const hashedPassword = await bcrypt.hash(password, 10);         

//         // ✅ Create new user with default products & cart         
//         const user = new User({ 
//             name, 
//             email, 
//             password: hashedPassword, 
//             provider: 'email', 
//             products: [],   // ✅ Empty array for user products
//             cart: []        // ✅ Empty array for user cart
//         });          

//         await user.save();         
//         res.status(201).json({ message: '✅ User registered successfully' });     
//     } catch (error) {         
//         console.error("❌ Registration Error:", error);         
//         res.status(500).json({ error: '❌ Internal Server Error' });     
//     } 
// });


app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: '❌ User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, provider: 'email' });
        await user.save();
        res.status(201).json({ message: '✅ User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: '❌ Internal Server Error' });
    }
});


// ✅ Email Login API
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: '❌ User not found' });
        }

        if (user.provider === 'google') {
            return res.status(400).json({ message: '❌ This email is registered with Google. Please use Google login.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: '❌ Incorrect password' });
        }

        req.session.user = user; // ✅ Email login ke liye session set karo
        res.json({ message: '✅ Login successful', user });
    } catch (error) {
        console.error("❌ Login Error:", error);
        res.status(500).json({ error: '❌ Internal Server Error' });
    }
});
// Seller Routes
app.post('/seller/add-product', upload.single('productimage'), async (req, res) => {
    try {
        console.log("Received add-product request:", req.body);

        // Check if user is logged in
        const user = req.session.user || (req.isAuthenticated() ? req.user : null);

        if (!user) {
            return res.status(401).json({ error: "❌ Not authenticated" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "❌ No image file uploaded" });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Remove temporary file
        fs.unlinkSync(req.file.path);

        // Create product object
        const product = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            imageUrl: result.secure_url,
            public_id: result.public_id,
            seller: user.email,
            createdAt: new Date()
        };

        // Find user in database and update
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ error: "❌ User not found" });
        }

        // Add product to user's products array
        if (!dbUser.products) {
            dbUser.products = [];
        }
        dbUser.products.push(product);
        await dbUser.save();

        res.status(200).json({
            message: "✅ Product added successfully",
            product
        });

    } catch (error) {
        console.error("❌ Error adding product:", error);
        res.status(500).json({ error: "❌ Internal Server Error: " + error.message });
    }
});

app.get("/api/products", async (req, res) => {
    try {
        let category = req.query.category;

        let query = {};
        if (category && category !== "null") {
            query = { "products.category": category };
        }

        let usersWithProducts = await User.find(query);

        let products = [];
        usersWithProducts.forEach(user => {
            user.products.forEach(product => {
                if (!category || category === "null" || product.category === category) {
                    products.push(product);
                }
            });
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

//cart ke liye hai bhai

app.get('/api/cart', async (req, res) => {
    const userId = req.user._id; // Assume user is logged in
    const user = await User.findById(userId).populate('cart.product');

    res.json(user.cart);
});

app.post('/api/update-cart', async (req, res) => {
    const { productId, change } = req.body;
    const user = await User.findById(req.user._id);

    const cartItem = user.cart.find(item => item.product.toString() === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            user.cart = user.cart.filter(item => item.product.toString() !== productId);
        }
    }

    await user.save();
    res.json({ success: true });
});

app.post('/api/remove-from-cart', async (req, res) => {
    const { productId } = req.body;

    // Get user from either passport or session
    const user = req.user || req.session.user;

    if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    const userFromDB = await User.findById(user._id);
    userFromDB.cart = userFromDB.cart.filter(item => item.product.toString() !== productId);

    await userFromDB.save();
    req.session.user = userFromDB; // Update session with latest user data
    res.json({ success: true });
});

// Update product endpoint (for edit and add)
app.post('/seller/update-product', upload.single('image'), async (req, res) => {
    try {
        // Check if user is logged in
        const user = req.session.user || (req.isAuthenticated() ? req.user : null);

        if (!user) {
            return res.status(401).json({ error: "❌ Not authenticated" });
        }

        // Find user in database
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ error: "❌ User not found" });
        }

        const productIndex = parseInt(req.body.productIndex);
        let imageUrl, public_id;

        // If image uploaded, process it
        if (req.file) {
            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path);

            // Remove temporary file
            fs.unlinkSync(req.file.path);

            imageUrl = result.secure_url;
            public_id = result.public_id;

            // If updating existing product with image, delete old image from Cloudinary
            if (productIndex >= 0 &&
                dbUser.products[productIndex] &&
                dbUser.products[productIndex].public_id) {
                await cloudinary.uploader.destroy(dbUser.products[productIndex].public_id);
            }
        }

        // Create product object
        const product = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            seller: user.email,
            updatedAt: new Date()
        };

        // Add image data if available
        if (imageUrl) {
            product.imageUrl = imageUrl;
            product.public_id = public_id;
        }

        // Add or update product in user's products array
        if (productIndex >= 0 && productIndex < dbUser.products.length) {
            // Edit existing: preserve existing image if no new one uploaded
            if (!imageUrl && dbUser.products[productIndex].imageUrl) {
                product.imageUrl = dbUser.products[productIndex].imageUrl;
                product.public_id = dbUser.products[productIndex].public_id;
            }
            product.createdAt = dbUser.products[productIndex].createdAt;
            dbUser.products[productIndex] = product;
        } else {
            // Add new
            product.createdAt = new Date();
            if (!dbUser.products) {
                dbUser.products = [];
            }
            dbUser.products.push(product);
        }

        await dbUser.save();
        req.session.user = dbUser; // Update session with latest user data

        res.status(200).json({
            message: "✅ Product saved successfully",
            product
        });

    } catch (error) {
        console.error("❌ Error saving product:", error);
        res.status(500).json({ error: "❌ Internal Server Error: " + error.message });
    }
});

// Delete product endpoint
app.post('/seller/delete-product', async (req, res) => {
    try {
        // Check if user is logged in
        const user = req.session.user || (req.isAuthenticated() ? req.user : null);

        if (!user) {
            return res.status(401).json({ error: "❌ Not authenticated" });
        }

        const productIndex = req.body.productIndex;

        // Find user in database
        const dbUser = await User.findById(user._id);
        if (!dbUser) {
            return res.status(404).json({ error: "❌ User not found" });
        }

        // Check if product exists
        if (!dbUser.products || productIndex >= dbUser.products.length) {
            return res.status(404).json({ error: "❌ Product not found" });
        }

        // If product has image, delete from Cloudinary
        const product = dbUser.products[productIndex];
        if (product.public_id) {
            await cloudinary.uploader.destroy(product.public_id);
        }

        // Remove product from array
        dbUser.products.splice(productIndex, 1);
        await dbUser.save();
        req.session.user = dbUser; // Update session with latest user data

        res.status(200).json({ message: "✅ Product deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting product:", error);
        res.status(500).json({ error: "❌ Internal Server Error: " + error.message });
    }
});


// ✅ Start Server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));
