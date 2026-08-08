const fs = require("fs");
const path = require("path");
const Owner = require("../../Domain/entities/Owner");

const filePath = path.join(__dirname, "../../../Data/owners.json");

function getAllOwners() {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function saveOwners(owners) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(owners, null, 2),
        "utf8"
    );
}

function getNextId(owners) {
    if (owners.length === 0) {
        return 1;
    }

    return Math.max(...owners.map(owner => owner.id)) + 1;
}

function addOwner(ownerData) {
    const owners = getAllOwners();

    const owner = new Owner({
        id: getNextId(owners),
        name: ownerData.name
    });

    owners.push(owner);

    saveOwners(owners);

    return owner;
}

function findOwnerById(id) {
    const owners = getAllOwners();

    return owners.find(owner => owner.id === id) || null;
}

module.exports = {
    getAllOwners,
    addOwner,
    findOwnerById
};