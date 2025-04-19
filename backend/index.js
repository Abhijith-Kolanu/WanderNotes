require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const express = require('express');
const cors = require('cors');

const jwt = require('jsonwebtoken');
const upload = require('./multer');
const fs = require('fs');
const path = require('path');

const {authenticateToken} = require('./utilities');

const User = require('./models/user.model');
const TravelStory = require('./models/travelStory.model');

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));

//Create Account
app.post('/create-account', async (req, res) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({error: true, message: "All fields are required"});
    }

    const isUser = await User.findOne({email});
    if(isUser){
        return res.status(400).json({error: true, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
        fullName, 
        email, 
        password: hashedPassword,
    });

    await user.save();

    const accessToken = jwt.sign(
        {userId: user._id},
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "72h"
        }
    );

    return res.status(201).json({
        error: false,
        user: {fullName: user.fullName, email: user.email},
        accessToken,
        message: "Registration successful",
    });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
    );

    return res.status(200).json({
        message: "Login successful",
        user: {
            fullName: user.fullName,
            email: user.email
        },
        accessToken
    });
});


//Get User
app.get('/get-user', authenticateToken, async (req, res) => {
    const {userId} = req.user;

    const isUser = await User.findOne({_id: userId});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

// Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: true, message: "No image uploaded" });
      }
  
      const imageUrl = 'http://localhost:8000/uploads/${req.file.filename}';
  
      res.status(201).json({ imageUrl });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});
  
// Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
    const { imageUrl } = req.query;
  
    if (!imageUrl) {
      return res
        .status(400)
        .json({ error: true, message: "imageUrl parameter is required" });
    }
  
    try {
      // Extract the filename from the imageUrl
      const filename = path.basename(imageUrl);
  
      // Define the file path
      const filePath = path.join(__dirname, "uploads", filename);
  
      // Check if the file exists
      if (fs.existsSync(filePath)) {
        // Delete the file from the uploads folder
        fs.unlinkSync(filePath);
        res.status(200).json({ message: "Image deleted successfully" });
      } else {
        res.status(200).json({ error: true, message: "Image not found" });
      }
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));


// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
  
    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }
  
    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
  
    try {
      const travelStory = new TravelStory({
        title,
        story,
        visitedLocation,
        userId,
        imageUrl,
        visitedDate: parsedVisitedDate,
      });
  
      await travelStory.save();
      res.status(201).json({ story: travelStory, message: 'Added Successfully' });
    } catch (error) {
      res.status(400).json({ error: true, message: error.message });
    }
});

// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;
  
    try {
      const travelStories = await TravelStory.find({ userId }).sort({
        isFavourite: -1, // Descending order: Favourites first
      });
  
      res.status(200).json({ stories: travelStories });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});


//Edit travel story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  
    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
      return res.status(400).json({ error: true, message: "All fields are required" });
    }
  
    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));
  
    try {
      // Find the travel story by ID and ensure it belongs to the authenticated user
      const travelStory = await TravelStory.findOne({ _id: id, userId: req.user.id });
  
      if (!travelStory) {
        return res.status(404).json({ error: true, message: "Travel story not found" });
      }
  
      const placeholderImgUrl = 'http://localhost:8080/assets/placeholder.png';
  
      // Update the travel story
      travelStory.title = title;
      travelStory.story = story;
      travelStory.visitedLocation = visitedLocation;
      travelStory.imageUrl = imageUrl || placeholderImgUrl; // Use provided or placeholder
      travelStory.visitedDate = parsedVisitedDate;
  
      await travelStory.save();
  
      res.status(200).json({ story: travelStory, message: 'Update Successful' });
  
    } catch (error) {
      console.error("Error updating travel story:", error);
      res.status(500).json({ error: true, message: error.message });
    }
});
  
//Delete a travel story
app.delete("/delete-travel-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
  
    try {
      // Find the travel story by ID and ensure it belongs to the authenticated user
      const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
  
      if (!travelStory) {
        return res.status(404).json({ error: true, message: "Travel story not found" });
      }
  
      // Delete the travel story from the database
      await TravelStory.deleteOne({ _id: id, userId: userId });
  
      // Extract the filename from the imageUrl
      const imageUrl = travelStory.imageUrl;
      const filename = path.basename(imageUrl);
  
      // Define the file path
      const filePath = path.join(__dirname, 'uploads', filename);
  
      // Delete the image file from the uploads folder
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
          // Optionally, you could still respond with a success status here
          // if you don't want to treat this as a critical error.
        }
      });
  
      res.status(200).json({ message: "Travel story deleted successfully" });
  
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

// Update the 'isFavourite' status of a travel story
app.put('/update-is-favourite/:id', authenticateToken, async (req, res) => {
    const { id } = req.params; // Get the travel story ID from URL parameters
    const { isFavourite } = req.body; // Get the new isFavourite value from the request body
    const { userId } = req.user; // Get the authenticated user's ID from the token
  
    try {
      // Find the travel story that matches the given ID and belongs to the authenticated user
      const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
  
      // If the story doesn't exist or doesn't belong to the user
      if (!travelStory) {
        return res.status(404).json({ error: true, message: "Travel story not found" });
      }
  
      // Update the isFavourite field and save the changes
      travelStory.isFavourite = isFavourite;
      await travelStory.save();
  
      // Respond with the updated story and a success message
      res.status(200).json({ story: travelStory, message: 'Update Successful' });
    } catch (error) {
      // Handle any errors during the process
      res.status(500).json({ error: true, message: error.message });
    }
  });
  

// Search travel stories
app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query; // Extract search query from URL query parameters
    const { userId } = req.user; // Extract user ID from the authenticated user object
  
    // If no query is provided, return an error
    if (!query) {
      return res.status(404).json({ error: true, message: "query is required" });
    }
  
    try {
      // Search for travel stories by the user where the query matches
      // the title, story content, or visited location (case-insensitive)
      const searchResults = await TravelStory.find({
        userId: userId,
        $or: [
          { title: { $regex: query, $options: "i" } },
          { story: { $regex: query, $options: "i" } },
          { visitedLocation: { $regex: query, $options: "i" } },
        ],
      }).sort({ isFavourite: -1 }); // Sort results to show favourites first
  
      // Return matching stories
      res.status(200).json({ stories: searchResults });
    } catch (error) {
      // Handle any server errors
      res.status(500).json({ error: true, message: error.message });
    }
  });
  
  
//Filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;
  
    try {
      // Convert startDate and endDate from milliseconds to Date objects
      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));
  
      // Find travel stories that belong to the authenticated user and fall within the date range
      const filteredStories = await TravelStory.find({
        userId: userId,
        visitedDate: { $gte: start, $lte: end },
      }).sort({ isFavourite: -1 });
  
      res.status(200).json({ stories: filteredStories });
    } catch (error) {
      res.status(500).json({ error: true, message: error.message });
    }
});

app.listen(8000);
module.exports = app;