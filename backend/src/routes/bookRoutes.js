import express from "express";
import Book from "../models/Book.js";
import cloudinary from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if (!image)
      return res.status(404).json({ message: "Please select a picture." });

    if (!title || !caption || !rating) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields." });
    }

    //upload image
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    // Save to the database
    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });

    await newBook
      .save()
      .then(() =>
        res
          .status(201)
          .json({ message: "Book created successfully.", book: newBook })
      )
      .catch((err) => {
        console.log("Error in saving book to the database :", err);
        return res.status(500).json({ message: "Internal server error." });
      });
  } catch (error) {
    console.log("Error in create book route :", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

// pagination => infinite loading
router.get("/", protectRoute, async (req, res) => {
  // example call from react native frontend
  // const response = await fetch("http://localhost:3001/api/books?page=1&limit=5");
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.log("Error in get books route :", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

// get recommended books by the logged in user
router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(books);
  } catch (error) {
    console.log("Get user books error :", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book not found." });

    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "You are not authorized to delete this book." });
    }

    // delete image from cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error.message);
      }
    }

    // delete book from database
    await book.deleteOne();

    res.json({ message: "Book deleted successfully." });
  } catch (error) {
    console.log("Error in delete book route :", error);
    res.status(500).json({ error: "Internal server error!" });
  }
});

export default router;
