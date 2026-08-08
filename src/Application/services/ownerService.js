const {
    getAllOwners,
    getOwnerById,
    addOwner,
    updateOwner,
    deleteOwner
} = require("../../Infrastructure/repositories/ownerRepository");

const {
    getAllRecords
} = require("../../Infrastructure/repositories/recordRepository");

function getOwners() {
    return getAllOwners();
}

function getOwner(id) {
    return getOwnerById(id);
}

function createOwner(data) {
    return addOwner(data);
}

function editOwner(id, data) {
    return updateOwner(id, data);
}

function removeOwner(id) {
    const owner = getOwnerById(id);

    if (!owner) {
        return {
            deleted: false,
            notFound: true
        };
    }

    const records = getAllRecords();

    const isUsed = records.some(record =>
        record.ownerId === id
    );

    if (isUsed) {
        return {
            deleted: false,
            inUse: true
        };
    }

    deleteOwner(id);

    return {
        deleted: true
    };
}

module.exports = {
    getOwners,
    getOwner,
    createOwner,
    editOwner,
    removeOwner
};