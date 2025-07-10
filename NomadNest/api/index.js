require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const Place = require('./models/Place.js');
const Booking = require('./models/Booking.js');
const Chat = require('./models/Chat.js');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const {S3Client, PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const fs = require('fs');
const mime = require('mime-types');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Rating = require('./models/Rating.js');
const Experience = require('./models/Experience.js');
const ExperienceBooking = require('./models/ExperienceBooking.js');

require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';


app.use(express.json());
app.use(cookieParser());
app.use('/api/uploads', express.static(__dirname + '/uploads'));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));


function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.get('/api/test', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json('test ok');
});

app.post('/api/register', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password} = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }

});

app.post('/api/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/api/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/api/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/api/upload-by-link', async (req,res) => {
  const {link} = req.body;
  const newName = 'photo' + Date.now() + '.jpg';
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' +newName,
  });
  
  res.json(newName);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/api/upload', photosMiddleware.array('photos', 100), async (req,res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const {path,originalname,mimetype} = req.files[i];
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
    const filename = newPath.split(/[\/\\]/).pop();
    uploadedFiles.push(filename);
  }
  res.json(uploadedFiles);
});

app.post('/api/places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});

app.get('/api/user-places', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await Place.find({owner:id}) );
  });
});

app.get('/api/user-experiences', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const {id} = userData;
    res.json( await Experience.find({provider:id}) );
  });
});

app.get('/api/places/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/api/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
});

app.get('/api/places', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await Place.find() );
});

app.post('/api/bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
  } = req.body;
  Booking.create({
    place,checkIn,checkOut,numberOfGuests,name,phone,price,
    user:userData.id,
  }).then((doc) => {
    res.json(doc);
  }).catch((err) => {
    throw err;
  });
});



app.get('/api/bookings', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  res.json( await Booking.find({user:userData.id}).populate('place') );
});

app.post('/api/chat', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const { message } = req.body;
  
  try {
    // Simple response based on keywords
    let response = "Thank you for your message. Our team will get back to you soon.";
    
    const keywords = {
      'booking': 'To make a booking:\n1. Find your desired property\n2. Select your dates\n3. Enter guest details\n4. Complete the payment',
      'payment': 'We accept all major credit cards and PayPal. Payment is processed securely at the time of booking.',
      'cancel': 'You can cancel your booking up to 24 hours before check-in for a full refund. Please check the property\'s specific cancellation policy.',
      'price': 'Prices vary by property and season. You can see the exact price when selecting your dates.',
      'contact': 'You can reach our support team at support@nomadnest.com or call us at +1-800-NOMAD'
    };

    // Check if the message contains any keywords
    const cleanMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(keywords)) {
      if (cleanMessage.includes(key)) {
        response = value;
        break;
      }
    }

    // Save the chat message
    const chat = await Chat.create({
      user: userData.id,
      message,
      response
    });

    res.json({ message, response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get('/api/chat', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const userData = await getUserDataFromReq(req).catch(() => null);
    
    if (userData) {
      const chats = await Chat.find({user: userData.id}).sort({createdAt: -1}).limit(10);
      res.json(chats);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents and ensure it's an integer
      currency: 'usd',
      description: 'NomadNest booking payment', // Required for Indian export transactions
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: {
        name: 'Customer Name', // This will be updated later with actual customer name
        address: {
          line1: 'Address Line 1', // This will be updated later with actual address
          city: 'City', // This will be updated later with actual city
          postal_code: 'Postal Code', // This will be updated later with actual postal code
          country: 'IN', // Default to India
        }
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/update-payment-intent', async (req, res) => {
  try {
    const { clientSecret, name, address } = req.body;
    // Get the PaymentIntent ID from the client secret
    const paymentIntentId = clientSecret.split('_secret')[0];
    await stripe.paymentIntents.update(paymentIntentId, {
      shipping: {
        name,
        address
      }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Update payment intent error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ratings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const userData = await getUserDataFromReq(req);
  const {place, ambience, service, food} = req.body;
  
  try {
    // Calculate overall rating as average of the three categories
    const overall = Math.round((ambience + service + food) / 3);
    
    const rating = await Rating.create({
      place,
      user: userData.id,
      ambience,
      service,
      food,
      overall
    });
    
    res.json(rating);
  } catch (error) {
    console.error('Rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

app.get('/api/places/:id/ratings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  
  try {
    const ratings = await Rating.find({place: id});
    const averageRatings = {
      ambience: 0,
      service: 0,
      food: 0,
      overall: 0
    };
    
    if (ratings.length > 0) {
      averageRatings.ambience = ratings.reduce((acc, curr) => acc + curr.ambience, 0) / ratings.length;
      averageRatings.service = ratings.reduce((acc, curr) => acc + curr.service, 0) / ratings.length;
      averageRatings.food = ratings.reduce((acc, curr) => acc + curr.food, 0) / ratings.length;
      averageRatings.overall = ratings.reduce((acc, curr) => acc + curr.overall, 0) / ratings.length;
    }
    
    res.json({ratings, averageRatings});
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
});

app.get('/api/places/:id/has-rated', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  const userData = await getUserDataFromReq(req);
  
  try {
    const rating = await Rating.findOne({
      place: id,
      user: userData.id
    });
    
    res.json({ hasRated: !!rating });
  } catch (error) {
    console.error('Check rating error:', error);
    res.status(500).json({ error: 'Failed to check rating status' });
  }
});

// Get all experiences
app.get('/api/experiences', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {type, location, minPrice, maxPrice, date} = req.query;
  
  let query = {};
  
  if (type) query.type = type;
  if (location) query.address = new RegExp(location, 'i');
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (date) {
    query['availability.date'] = {
      $gte: new Date(date),
      $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
    };
  }

  try {
    const experiences = await Experience.find(query)
      .populate('provider', 'name email')
      .sort({createdAt: -1});
    res.json(experiences);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch experiences'});
  }
});

// Get single experience
app.get('/api/experiences/:id', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('provider', 'name email')
      .populate('reviews.user', 'name');
    res.json(experience);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch experience'});
  }
});

// Create new experience
app.post('/api/experiences', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title, description, type, address, price,
    duration, maxGroupSize, photos, availability,
    tags, includedItems, requirements, cancellationPolicy
  } = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    const experienceDoc = await Experience.create({
      provider: userData.id,
      title,
      description,
      type,
      address,
      price: Number(price),
      duration: Number(duration),
      maxGroupSize: Number(maxGroupSize) || 10,
      photos: photos || [],
      availability: availability || [],
      tags: tags || [],
      includedItems: includedItems || [],
      requirements: requirements || [],
      cancellationPolicy: cancellationPolicy || 'Standard cancellation policy applies.'
    });
    res.json(experienceDoc);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({error: 'Failed to create experience'});
  }
});

app.put('/api/experiences/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const {
      title, description, type, address, price,
      duration, maxGroupSize, photos, availability,
      tags, includedItems, requirements, cancellationPolicy
    } = req.body;
    const experienceDoc = await Experience.findById(id);
    if (userData.id === experienceDoc.provider.toString()) {
      experienceDoc.set({
        title, description, type, address, price,
        duration, maxGroupSize, photos, availability,
        tags, includedItems, requirements, cancellationPolicy
      });
      await experienceDoc.save();
      res.json('ok');
    }
  });
});

// Book an experience
app.post('/api/experiences/:id/book', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {date, numberOfPeople, specialRequests} = req.body;

  try {
    const userData = await getUserDataFromReq(req);
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({error: 'Experience not found'});
    }

    // Check availability
    const availableSlot = experience.availability.find(
      slot => slot.date.toISOString().split('T')[0] === date && slot.slots >= numberOfPeople
    );

    if (!availableSlot) {
      return res.status(400).json({error: 'Not enough slots available'});
    }

    // Create booking
    const booking = await ExperienceBooking.create({
      experience: experience._id,
      user: userData.id,
      date: new Date(date),
      numberOfPeople,
      totalPrice: experience.price * numberOfPeople,
      specialRequests
    });

    // Update availability
    availableSlot.slots -= numberOfPeople;
    await experience.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({error: 'Failed to book experience'});
  }
});

// Get user's experience bookings
app.get('/api/experience-bookings', async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  
  try {
    const userData = await getUserDataFromReq(req);
    const bookings = await ExperienceBooking.find({user: userData.id})
      .populate('experience')
      .sort({date: -1});
    res.json(bookings);
  } catch (error) {
    res.status(500).json({error: 'Failed to fetch bookings'});
  }
});

app.listen(4000);