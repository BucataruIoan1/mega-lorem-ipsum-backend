const express = require("express");
const {
    getCategories,
    createCategory
} = require("../Application/services/categoryService");

const router = express.Router();

router.get("/", (req, res) => {
    const categories = getCategories();

    return res.status(200).json(categories);
});

router.post("/", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const category = createCategory({ name });

    return res.status(201).json(category);
});

module.exports = router;