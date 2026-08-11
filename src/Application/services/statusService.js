const {
    getAllStatuses,
    getStatusById
} = require("../../Infrastructure/repositories/statusRepository");

function getStatuses() {
    return getAllStatuses();
}

function getStatus(id) {
    return getStatusById(id);
}

module.exports = {
    getStatuses,
    getStatus
};
