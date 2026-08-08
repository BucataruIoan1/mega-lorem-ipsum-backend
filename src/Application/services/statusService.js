const {
    getAllStatuses,
    getStatusById,
    addStatus,
    updateStatus,
    deleteStatus
} = require("../../Infrastructure/repositories/statusRepository");

const {
    getAllRecords
} = require("../../Infrastructure/repositories/recordRepository");

function getStatuses() {
    return getAllStatuses();
}

function getStatus(id) {
    return getStatusById(id);
}

function createStatus(data) {
    return addStatus(data);
}

function editStatus(id, data) {
    return updateStatus(id, data);
}

function removeStatus(id) {
    const status = getStatusById(id);

    if (!status) {
        return {
            deleted: false,
            notFound: true
        };
    }

    const records = getAllRecords();

    const isUsed = records.some(record =>
        record.statusId === id
    );

    if (isUsed) {
        return {
            deleted: false,
            inUse: true
        };
    }

    deleteStatus(id);

    return {
        deleted: true
    };
}

module.exports = {
    getStatuses,
    getStatus,
    createStatus,
    editStatus,
    removeStatus
};