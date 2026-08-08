const express = require("express");

const {
    getAllRecordDtos,
    getRecordDtoById,
    createRecord,
    editRecord,
    removeRecord
} = require("../Application/services/recordService");

const router = express.Router();

router.get("/", (req, res) => {
    const records = getAllRecordDtos();

    return res.status(200).json(records);
});

router.get("/:id", (req, res) => {
    const record = getRecordDtoById(Number(req.params.id));

    if (!record) {
        return res.status(404).json({
            message: "Record not found."
        });
    }

    return res.status(200).json(record);
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

router.put("/:id", (req, res) => {
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
        const record = editRecord(
            Number(req.params.id),
            {
                content,
                categoryId,
                statusId,
                ownerId,
                priorityId
            }
        );

        if (!record) {
            return res.status(404).json({
                message: "Record not found."
            });
        }

        return res.status(200).json(record);
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
});

router.delete("/:id", (req, res) => {
    const deleted = removeRecord(Number(req.params.id));

    if (!deleted) {
        return res.status(404).json({
            message: "Record not found."
        });
    }

    return res.status(204).send();
});

module.exports = router;