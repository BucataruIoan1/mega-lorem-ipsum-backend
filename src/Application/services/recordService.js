const {
    getAllRecords,
    addRecord
} = require("../../Infrastructure/repositories/recordRepository");

const {
    findCategoryById
} = require("../../Infrastructure/repositories/categoryRepository");

const {
    findStatusById
} = require("../../Infrastructure/repositories/statusRepository");

const {
    findOwnerById
} = require("../../Infrastructure/repositories/ownerRepository");

const {
    findPriorityById
} = require("../../Infrastructure/repositories/priorityRepository");

const {
    mapRecordToDto
} = require("../mappers/recordMapper");

function getAllRecordDtos() {
    return getAllRecords().map(record => {
        const category = findCategoryById(record.categoryId);
        const status = findStatusById(record.statusId);
        const owner = findOwnerById(record.ownerId);
        const priority = findPriorityById(record.priorityId);

        return mapRecordToDto(
            record,
            category,
            status,
            owner,
            priority
        );
    });
}

function createRecord(data) {
    if (!findCategoryById(data.categoryId)) {
        throw new Error("Category not found.");
    }

    if (!findStatusById(data.statusId)) {
        throw new Error("Status not found.");
    }

    if (!findOwnerById(data.ownerId)) {
        throw new Error("Owner not found.");
    }

    if (!findPriorityById(data.priorityId)) {
        throw new Error("Priority not found.");
    }

    return addRecord(data);
}

module.exports = {
    getAllRecordDtos,
    createRecord
};