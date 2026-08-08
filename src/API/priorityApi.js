const express = require("express");
const {
    getPriorities,
    createPriority
} = require("../Application/services/priorityService");

const router = express.Router();

router.get("/", (req, res) => {
    const priorities = getPriorities();

    return res.status(200).json(priorities);
});

router.post("/", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const priority = createPriority({ name });

    return res.status(201).json(priority);
});

module.exports = router;