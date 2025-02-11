const express = require("express");
const multer = require("multer");
const Issue = require("../models/Issue");

const router = express.Router();




// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ votes: -1 }); // Sort issues by votes in descending order
    res.status(200).json(issues);
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Within Week', 'Within Month', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const updatedIssue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Status updated successfully', issue: updatedIssue });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      description,
      issueType,
      priority,
      contactInfo,
      latitude,
      longitude,
      locationName,
    } = req.body;

    // Validate required fields
    if (!description || !issueType || !priority || !latitude || !longitude || !locationName) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    // Create a new issue instance
    const newIssue = new Issue({
      description,
      issueType,
      priority,
      contactInfo,
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
      locationName, // Save location name
      image: req.file ? `/uploads/${req.file.filename}` : null, // Save file path if image is provided
    });

    // Save issue to the database
    await newIssue.save();

    res.status(201).json({ message: "Issue reported successfully", issue: newIssue });
  } catch (error) {
    console.error("Error saving issue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Increment the vote count for an issue
router.patch('/:id/vote', async (req, res) => {
  console.log(`PATCH /api/issues/${req.params.id}/vote hit`);
  console.log(`Received PATCH request to vote for issue ID: ${req.params.id}`);
  try {
    const { id } = req.params;

    // Increment the vote count
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { $inc: { votes: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.status(200).json({ message: 'Vote added successfully', issue: updatedIssue });
  } catch (error) {
    console.error('Error updating votes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
