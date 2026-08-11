const express = require("express");

const {
    getAllRecordDtos,
    getRecordDtoById,
    createRecord,
    editRecord,
    removeRecord,
    generateLoremRecords
} = require("../Application/services/recordService");

const router = express.Router();

router.get("/", (req, res) => {
    const {
        page = "1",
        pageSize = "20",
        search = "",
        categoryId,
        statusId,
        ownerId,
        priorityId,
        sortBy,
        sortDir = "asc"
    } = req.query;

    const allowedPageSizes = [10, 20, 50];
    const allowedSortBy = [
        "id",
        "content",
        "category",
        "status",
        "owner",
        "priority",
        "lastModified"
    ];
    const allowedSortDir = ["asc", "desc"];

    const parsedPage = Number(page);

    if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        return res.status(400).json({
            message: "Page must be a positive integer."
        });
    }

    let parsedPageSize;

    if (pageSize === "all") {
        parsedPageSize = "all";
    } else {
        parsedPageSize = Number(pageSize);

        if (!allowedPageSizes.includes(parsedPageSize)) {
            return res.status(400).json({
                message: "Page size must be 10, 20, 50 or all."
            });
        }
    }

    let parsedSortBy = null;

    if (sortBy != null && sortBy !== "") {
        if (!allowedSortBy.includes(sortBy)) {
            return res.status(400).json({
                message: `sortBy must be one of: ${allowedSortBy.join(", ")}.`
            });
        }

        parsedSortBy = sortBy;
    }

    let parsedSortDir = "asc";

    if (sortDir != null && sortDir !== "") {
        const normalizedDir = String(sortDir).toLowerCase();

        if (!allowedSortDir.includes(normalizedDir)) {
            return res.status(400).json({
                message: "sortDir must be 'asc' or 'desc'."
            });
        }

        parsedSortDir = normalizedDir;
    }

    const result = getAllRecordDtos({
        page: parsedPage,
        pageSize: parsedPageSize,
        search,
        categoryId: categoryId ? Number(categoryId) : null,
        statusId: statusId ? Number(statusId) : null,
        ownerId: ownerId ? Number(ownerId) : null,
        priorityId: priorityId ? Number(priorityId) : null,
        sortBy: parsedSortBy,
        sortDir: parsedSortDir
    });

    return res.status(200).json(result);
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

router.post("/generate-lorem", (req, res) => {
    const { count } = req.body;

    const allowedCounts = [10, 20, 50, 100, 200];

    const parsedCount = Number(count);

    if (!allowedCounts.includes(parsedCount)) {
        return res.status(400).json({
            message: "Count must be one of: 10, 20, 50, 100, 200."
        });
    }

    const records = generateLoremRecords(parsedCount);

    return res.status(201).json({
        message: `Successfully generated ${records.length} records.`,
        generatedCount: records.length,
        records
    });
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