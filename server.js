const dotenv = require("dotenv");
dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const bookRoutes = require("./routes/books");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(logger);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log("Connection Error:", err.message));

app.get("/", (req, res) => {
    res.status(200).json({ message: "Bookstore API is running" });
});

app.use("/api/books", bookRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});