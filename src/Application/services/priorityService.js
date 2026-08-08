const {
    getAllPriorities,
    addPriority
} = require("../../Infrastructure/repositories/priorityRepository");

function getPriorities() {
    return getAllPriorities();
}

function createPriority(data) {
    return addPriority(data);
}

module.exports = {
    getPriorities,
    createPriority
};