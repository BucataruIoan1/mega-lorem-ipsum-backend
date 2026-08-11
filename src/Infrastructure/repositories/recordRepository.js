const fs = require("fs");
const path = require("path");
const Record = require("../../Domain/entities/Record");

const filePath = path.join(
    __dirname,
    "../../Data/records.json"
);

function getAllRecords() {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
}

function getRecordById(id) {
    const records = getAllRecords();

    return records.find(record => record.id === id) || null;
}

function getNextId(records) {
    if (records.length === 0) {
        return 1;
    }

    return Math.max(...records.map(record => record.id)) + 1;
}

function saveRecords(records) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(records, null, 2),
        "utf8"
    );
}

function addRecord(recordData) {
    const records = getAllRecords();

    const record = new Record({
        id: getNextId(records),
        content: recordData.content,
        categoryId: recordData.categoryId,
        statusId: recordData.statusId,
        ownerId: recordData.ownerId,
        priorityId: recordData.priorityId
    });

    records.push(record);

    saveRecords(records);

    return record;
}

function updateRecord(id, recordData) {
    const records = getAllRecords();

    const record = records.find(record => record.id === id);

    if (!record) {
        return null;
    }

    const hasChanges =
        record.content !== recordData.content ||
        record.categoryId !== recordData.categoryId ||
        record.statusId !== recordData.statusId ||
        record.ownerId !== recordData.ownerId ||
        record.priorityId !== recordData.priorityId;

    if (hasChanges) {
        record.content = recordData.content;
        record.categoryId = recordData.categoryId;
        record.statusId = recordData.statusId;
        record.ownerId = recordData.ownerId;
        record.priorityId = recordData.priorityId;
        record.lastModified = new Date().toLocaleTimeString(
            "en-GB",
            { hour12: false }
        );

        saveRecords(records);
    }

    return record;
}

function deleteRecord(id) {
    const records = getAllRecords();

    const index = records.findIndex(record => record.id === id);

    if (index === -1) {
        return false;
    }

    records.splice(index, 1);

    saveRecords(records);

    return true;
}

function addRecordsBulk(recordsData) {
    const records = getAllRecords();

    let currentId = getNextId(records);

    const newRecords = recordsData.map(recordData => {
        const record = new Record({
            id: currentId++,
            content: recordData.content,
            categoryId: recordData.categoryId,
            statusId: recordData.statusId,
            ownerId: recordData.ownerId,
            priorityId: recordData.priorityId
        });

        return record;
    });

    records.push(...newRecords);

    saveRecords(records);

    return newRecords;
}

module.exports = {
    getAllRecords,
    getRecordById,
    addRecord,
    updateRecord,
    deleteRecord,
    addRecordsBulk
};