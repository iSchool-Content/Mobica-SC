const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MenuItem = require("./models/MenuItem");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/bytebites", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("MongoDB error:", err));

app.get("/", (req, res) => {
    res.send("Welcome to ByteBites API — Now Powered by MongoDB!");
});

app.get("/menu", async (req, res) => {
    const items = await MenuItem.find();
    res.json(items);
});

app.get("/menu/:id", async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found." });
        res.json(item);
    } catch {
        res.status(400).json({ error: "Invalid ID." });
    }
});

app.post("/menu", async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: "Missing name or price." });
    }

    const newItem = new MenuItem({ name, price });
    await newItem.save();
    res.status(201).json({ message: "Item added!", item: newItem });
});

app.put("/menu/:id", async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updatedItem) return res.status(404).json({ error: "Item not found." });
        res.json({ message: "Item updated.", item: updatedItem });
    } catch {
        res.status(400).json({ error: "Invalid update." });
    }
});

app.delete("/menu/:id", async (req, res) => {
    try {
        const deleted = await MenuItem.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Item not found." });
        res.json({ message: "Item deleted." });
    } catch {
        res.status(400).json({ error: "Invalid ID." });
    }
});

app.listen(3000, () => {
    console.log("ByteBites API running on http://localhost:3000");
});
