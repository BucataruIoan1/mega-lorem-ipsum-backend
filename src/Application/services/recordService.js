const {
    getAllRecords,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord
} = require("../../Infrastructure/repositories/recordRepository");

const {
    getCategoryById
} = require("../../Infrastructure/repositories/categoryRepository");

const {
    getStatusById
} = require("../../Infrastructure/repositories/statusRepository");

const {
    getOwnerById
} = require("../../Infrastructure/repositories/ownerRepository");

const {
    getPriorityById
} = require("../../Infrastructure/repositories/priorityRepository");

const {
    mapRecordToDto
} = require("../mappers/recordMapper");

function getAllRecordDtos() {
    return getAllRecords().map(record => {
        const category = getCategoryById(record.categoryId);
        const status = getStatusById(record.statusId);
        const owner = getOwnerById(record.ownerId);
        const priority = getPriorityById(record.priorityId);

        return mapRecordToDto(
            record,
            category,
            status,
            owner,
            priority
        );
    });
}

function getRecordDtoById(id) {
    const record = getRecordById(id);

    if (!record) {
        return null;
    }

    const category = getCategoryById(record.categoryId);
    const status = getStatusById(record.statusId);
    const owner = getOwnerById(record.ownerId);
    const priority = getPriorityById(record.priorityId);

    return mapRecordToDto(
        record,
        category,
        status,
        owner,
        priority
    );
}

function validateRelations(data) {
    if (!getCategoryById(data.categoryId)) {
        throw new Error("Category not found.");
    }

    if (!getStatusById(data.statusId)) {
        throw new Error("Status not found.");
    }

    if (!getOwnerById(data.ownerId)) {
        throw new Error("Owner not found.");
    }

    if (!getPriorityById(data.priorityId)) {
        throw new Error("Priority not found.");
    }
}

function createRecord(data) {
    validateRelations(data);

    return addRecord(data);
}

function editRecord(id, data) {
    const existingRecord = getRecordById(id);

    if (!existingRecord) {
        return null;
    }

    validateRelations(data);

    return updateRecord(id, data);
}

function removeRecord(id) {
    return deleteRecord(id);
}

module.exports = {
    getAllRecordDtos,
    getRecordDtoById,
    createRecord,
    editRecord,
    removeRecord
};