const express = require("express");
const {
    getOwners,
    createOwner
} = require("../Application/services/ownerService");

const router = express.Router();

router.get("/", (req, res) => {
    const owners = getOwners();

    return res.status(200).json(owners);
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

module.exports = router;