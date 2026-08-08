const {
    getAllStatuses,
    addStatus
} = require("../../Infrastructure/repositories/statusRepository");

function getStatuses() {
    return getAllStatuses();
}

function createStatus(data) {
    return addStatus(data);
}

module.exports = {
    getStatuses,
    createStatus
};