const express = require("express");

const {
    getAllRecordDtos,
    createRecord
} = require("../Application/services/recordService");

const router = express.Router();

router.get("/", (req, res) => {
    const records = getAllRecordDtos();

    return res.status(200).json(records);
});

router.post("/", (req, res) => {
    const {
        content,
        categoryId,
        statusId,
        ownerId,
        priorityId
    } = req.body;

    if (
        !content ||
        categoryId == null ||
        statusId == null ||
        ownerId == null ||
        priorityId == null
    ) {
        return res.status(400).json({
            message: "All fields are required."
        });
    }

    try {
        const record = createRecord({
            content,
            categoryId,
            statusId,
            ownerId,
            priorityId
        });

        return res.status(201).json(record);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

module.exports = router;