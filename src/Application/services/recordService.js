const {
    getAllRecords,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord,
    addRecordsBulk
} = require("../../Infrastructure/repositories/recordRepository");

const {
    getCategoryById
} = require("../../Infrastructure/repositories/categoryRepository");

const {
    getStatusById,
    getAllStatuses
} = require("../../Infrastructure/repositories/statusRepository");

const {
    getOwnerById
} = require("../../Infrastructure/repositories/ownerRepository");

const {
    getPriorityById,
    getAllPriorities
} = require("../../Infrastructure/repositories/priorityRepository");

const {
    mapRecordToDto
} = require("../mappers/recordMapper");

function getAllRecordDtos(options = {}) {
    const {
        page = 1,
        pageSize = 20,
        search = "",
        categoryId = null,
        statusId = null,
        ownerId = null,
        priorityId = null,
        sortBy = null,
        sortDir = "asc"
    } = options;

    let records = getAllRecords();

    if (categoryId !== null) {
        records = records.filter(
            record => record.categoryId === categoryId
        );
    }

    if (statusId !== null) {
        records = records.filter(
            record => record.statusId === statusId
        );
    }

    if (ownerId !== null) {
        records = records.filter(
            record => record.ownerId === ownerId
        );
    }

    if (priorityId !== null) {
        records = records.filter(
            record => record.priorityId === priorityId
        );
    }

    let recordDtos = records.map(record => {
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

    if (search.trim()) {
        const searchValue = search.trim().toLowerCase();

        recordDtos = recordDtos.filter(record => {
            return (
                record.content?.toLowerCase().includes(searchValue) ||
                record.category?.toLowerCase().includes(searchValue) ||
                record.status?.toLowerCase().includes(searchValue) ||
                record.owner?.toLowerCase().includes(searchValue) ||
                record.priority?.toLowerCase().includes(searchValue)
            );
        });
    }

    if (sortBy) {
        const direction = sortDir === "desc" ? -1 : 1;

        recordDtos.sort((a, b) => {
            const valA = a[sortBy];
            const valB = b[sortBy];

            if (typeof valA === "number" && typeof valB === "number") {
                return (valA - valB) * direction;
            }

            const strA = String(valA ?? "").toLowerCase();
            const strB = String(valB ?? "").toLowerCase();

            if (strA < strB) {
                return -1 * direction;
            }

            if (strA > strB) {
                return 1 * direction;
            }

            return 0;
        });
    }

    const totalRecords = recordDtos.length;

    if (pageSize === "all") {
        return {
            data: recordDtos,
            pagination: {
                page: 1,
                pageSize: "all",
                totalRecords,
                totalPages: totalRecords > 0 ? 1 : 0
            }
        };
    }

    let totalPages = Math.ceil(totalRecords / pageSize);

    if (totalPages < 0) {
        totalPages = 0;
    }

    let normalizedPage = page;

    if (totalRecords === 0) {
        normalizedPage = 1;
    } else if (page > totalPages) {
        normalizedPage = totalPages;
    } else if (page < 1) {
        normalizedPage = 1;
    }

    const startIndex = (normalizedPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedRecords = recordDtos.slice(
        startIndex,
        endIndex
    );

    return {
        data: paginatedRecords,
        pagination: {
            page: normalizedPage,
            pageSize,
            totalRecords,
            totalPages
        }
    };
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

function generateLoremRecords(count) {
    const statuses = getAllStatuses();
    const priorities = getAllPriorities();

    const statusIds = statuses.map(s => s.id).sort((a, b) => a - b);
    const priorityIds = priorities.map(p => p.id).sort((a, b) => a - b);

    const recordsData = [];

    for (let i = 0; i < count; i++) {
        const statusId = statusIds[i % statusIds.length];
        const priorityId = priorityIds[i % priorityIds.length];

        recordsData.push({
            content: "Lorem",
            categoryId: 1,
            statusId,
            ownerId: 1,
            priorityId
        });
    }

    return addRecordsBulk(recordsData);
}

module.exports = {
    getAllRecordDtos,
    getRecordDtoById,
    createRecord,
    editRecord,
    removeRecord,
    generateLoremRecords
};