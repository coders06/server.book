const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Book = require("./models/Book.js");

/////// .env ni yuklash
dotenv.config();

const app = express();  

/////// middleware
app.use(express.json());

/////// MongoDB ulanish
connectDB();

/////////////////////// CREATE (POST)
app.post("/books", async (req, res) => {
  try {
    const { title, author, pages } = req.body;

    if (!title || !author || !pages) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = new Book({
      title,
      author,
      pages,
    });

    await newBook.save();

    res.json({ message: "Book added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////// READ ALL (GET)
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////// READ ONE (GET by ID)
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////// UPDATE (PUT)
app.put("/books/:id", async (req, res) => {
  try {
    const { title, author, pages } = req.body;

    if (!title || !author || !pages) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, pages },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/////////////////////// DELETE
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

/////// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});