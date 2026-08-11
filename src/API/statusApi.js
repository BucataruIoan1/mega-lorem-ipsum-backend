const express = require("express");

const {
    getStatuses,
    getStatus
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

module.exports = router;
