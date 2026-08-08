const fs = require("fs");
const path = require("path");
const Record = require("../../../Domain/entities/Record");

const filePath = path.join(
    __dirname,
    "../../../Data/records.json"
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

module.exports = {
    getAllRecords,
    getRecordById,
    addRecord
};