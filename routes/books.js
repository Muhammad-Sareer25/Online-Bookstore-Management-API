const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({ success: true, data: books });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { author, genre, page = 1, limit = 10 } = req.query;

        // Build search filter
        const filter = {};
        if (author) {
            filter.author = { $regex: author, $options: "i" };
        }
        if (genre) {
            filter.genre = { $regex: genre, $options: "i" };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalBooks = await Book.countDocuments(filter);
        const books = await Book.find(filter)
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            count: books.length,
            total: totalBooks,
            page: pageNum,
            totalPages: Math.ceil(totalBooks / limitNum),
            data: books
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { title, author, price } = req.body;

        if (!title || !author || !price) {
            return res.status(400).json({ success: false, error: "title, author and price are required" });
        }

        const book = await Book.create(req.body);
        res.status(201).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!book) {
            return res.status(404).json({ success: false, error: "Book not found" });
        }
        res.status(200).json({ success: true, data: book });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({ success: false, error: "Book not found" });
        }
        res.status(200).json({ success: true, message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
