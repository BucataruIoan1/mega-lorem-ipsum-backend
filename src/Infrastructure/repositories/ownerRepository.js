const fs = require("fs");
const path = require("path");
const Owner = require("../../Domain/entities/Owner");

const filePath = path.join(
    __dirname,
    "../../Data/owners.json"
);

function getAllOwners() {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function getOwnerById(id) {
    const owners = getAllOwners();

    return owners.find(owner => owner.id === id) || null;
}

function getNextId(owners) {
    if (owners.length === 0) {
        return 1;
    }

    return Math.max(...owners.map(owner => owner.id)) + 1;
}

function saveOwners(owners) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(owners, null, 2),
        "utf8"
    );
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

function updateOwner(id, ownerData) {
    const owners = getAllOwners();

    const owner = owners.find(owner => owner.id === id);

    if (!owner) {
        return null;
    }

    owner.name = ownerData.name;

    saveOwners(owners);

    return owner;
}

function deleteOwner(id) {
    const owners = getAllOwners();

    const index = owners.findIndex(owner => owner.id === id);

    if (index === -1) {
        return false;
    }

    owners.splice(index, 1);

    saveOwners(owners);

    return true;
}

module.exports = {
    getAllOwners,
    getOwnerById,
    addOwner,
    updateOwner,
    deleteOwner
};