const {
    getAllOwners,
    addOwner
} = require("../../Infrastructure/repositories/ownerRepository");

function getOwners() {
    return getAllOwners();
}

function createOwner(data) {
    return addOwner(data);
}

module.exports = {
    getOwners,
    createOwner
};