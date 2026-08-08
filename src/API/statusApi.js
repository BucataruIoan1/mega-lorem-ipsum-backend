const express = require("express");

const {
    getStatuses,
    getStatus,
    createStatus,
    editStatus,
    removeStatus
} = require("../Application/services/statusService");

const router = express.Router();

router.get("/", (req, res) => {
    const statuses = getStatuses();

    return res.status(200).json(statuses);
});

router.get("/:id", (req, res) => {
    const status = getStatus(Number(req.params.id));

    if (!status) {
        return res.status(404).json({
            message: "Status not found."
        });
    }

    return res.status(200).json(status);
});

router.post("/", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const status = createStatus({ name });

    return res.status(201).json(status);
});

router.put("/:id", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const status = editStatus(
        Number(req.params.id),
        { name }
    );

    if (!status) {
        return res.status(404).json({
            message: "Status not found."
        });
    }

    return res.status(200).json(status);
});

router.delete("/:id", (req, res) => {
    const result = removeStatus(Number(req.params.id));

    if (result.notFound) {
        return res.status(404).json({
            message: "Status not found."
        });
    }

    if (result.inUse) {
        return res.status(409).json({
            message: "Status cannot be deleted because it is used by one or more records."
        });
    }

    return res.status(204).send();
});

module.exports = router;