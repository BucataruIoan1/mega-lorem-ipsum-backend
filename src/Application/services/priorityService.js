const {
    getAllPriorities,
    getPriorityById,
    addPriority,
    updatePriority,
    deletePriority
} = require("../../Infrastructure/repositories/priorityRepository");

const {
    getAllRecords
} = require("../../Infrastructure/repositories/recordRepository");

function getPriorities() {
    return getAllPriorities();
}

function getPriority(id) {
    return getPriorityById(id);
}

function createPriority(data) {
    return addPriority(data);
}

function editPriority(id, data) {
    return updatePriority(id, data);
}

function removePriority(id) {
    const priority = getPriorityById(id);

    if (!priority) {
        return {
            deleted: false,
            notFound: true
        };
    }

    const records = getAllRecords();

    const isUsed = records.some(record =>
        record.priorityId === id
    );

    if (isUsed) {
        return {
            deleted: false,
            inUse: true
        };
    }

    deletePriority(id);

    return {
        deleted: true
    };
}

module.exports = {
    getPriorities,
    getPriority,
    createPriority,
    editPriority,
    removePriority
};