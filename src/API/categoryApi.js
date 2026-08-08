const express = require("express");

const {
    getCategories,
    getCategory,
    createCategory,
    editCategory,
    removeCategory
} = require("../Application/services/categoryService");

const router = express.Router();

router.get("/", (req, res) => {
    const categories = getCategories();

    return res.status(200).json(categories);
});

router.get("/:id", (req, res) => {
    const category = getCategory(Number(req.params.id));

    if (!category) {
        return res.status(404).json({
            message: "Category not found."
        });
    }

    return res.status(200).json(category);
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

router.put("/:id", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const category = editCategory(
        Number(req.params.id),
        { name }
    );

    if (!category) {
        return res.status(404).json({
            message: "Category not found."
        });
    }

    return res.status(200).json(category);
});

router.delete("/:id", (req, res) => {
    const result = removeCategory(Number(req.params.id));

    if (result.notFound) {
        return res.status(404).json({
            message: "Category not found."
        });
    }

    if (result.inUse) {
        return res.status(409).json({
            message: "Category cannot be deleted because it is used by one or more records."
        });
    }

    return res.status(204).send();
});

module.exports = router;