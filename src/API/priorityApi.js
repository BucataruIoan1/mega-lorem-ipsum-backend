const express = require("express");

const {
    getPriorities,
    getPriority
} = require("../Application/services/priorityService");

const router = express.Router();

router.get("/", (req, res) => {
    const priorities = getPriorities();

    return res.status(200).json(priorities);
});

router.get("/:id", (req, res) => {
    const priority = getPriority(Number(req.params.id));

    if (!priority) {
        return res.status(404).json({
            message: "Priority not found."
        });
    }

    return res.status(200).json(priority);
});

module.exports = router;
