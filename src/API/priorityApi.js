const express = require("express");

const {
    getPriorities,
    getPriority,
    createPriority,
    editPriority,
    removePriority
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

router.put("/:id", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const priority = editPriority(
        Number(req.params.id),
        { name }
    );

    if (!priority) {
        return res.status(404).json({
            message: "Priority not found."
        });
    }

    return res.status(200).json(priority);
});

router.delete("/:id", (req, res) => {
    const result = removePriority(Number(req.params.id));

    if (result.notFound) {
        return res.status(404).json({
            message: "Priority not found."
        });
    }

    if (result.inUse) {
        return res.status(409).json({
            message: "Priority cannot be deleted because it is used by one or more records."
        });
    }

    return res.status(204).send();
});

module.exports = router;