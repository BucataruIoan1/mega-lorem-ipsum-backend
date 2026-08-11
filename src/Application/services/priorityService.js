const {
    getAllPriorities,
    getPriorityById
} = require("../../Infrastructure/repositories/priorityRepository");

function getPriorities() {
    return getAllPriorities();
}

function getPriority(id) {
    return getPriorityById(id);
}

module.exports = {
    getPriorities,
    getPriority
};
