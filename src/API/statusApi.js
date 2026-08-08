const express = require("express");
const {
    getStatuses,
    createStatus
} = require("../Application/services/statusService");

const router = express.Router();

router.get("/", (req, res) => {
    const statuses = getStatuses();

    return res.status(200).json(statuses);
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

module.exports = router;