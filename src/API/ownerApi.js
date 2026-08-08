const express = require("express");

const {
    getOwners,
    getOwner,
    createOwner,
    editOwner,
    removeOwner
} = require("../Application/services/ownerService");

const router = express.Router();

router.get("/", (req, res) => {
    const owners = getOwners();

    return res.status(200).json(owners);
});

router.get("/:id", (req, res) => {
    const owner = getOwner(Number(req.params.id));

    if (!owner) {
        return res.status(404).json({
            message: "Owner not found."
        });
    }

    return res.status(200).json(owner);
});

router.post("/", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const owner = createOwner({ name });

    return res.status(201).json(owner);
});

router.put("/:id", (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Name is required."
        });
    }

    const owner = editOwner(
        Number(req.params.id),
        { name }
    );

    if (!owner) {
        return res.status(404).json({
            message: "Owner not found."
        });
    }

    return res.status(200).json(owner);
});

router.delete("/:id", (req, res) => {
    const result = removeOwner(Number(req.params.id));

    if (result.notFound) {
        return res.status(404).json({
            message: "Owner not found."
        });
    }

    if (result.inUse) {
        return res.status(409).json({
            message: "Owner cannot be deleted because it is used by one or more records."
        });
    }

    return res.status(204).send();
});

module.exports = router;