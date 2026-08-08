const fs = require("fs");
const path = require("path");
const Status = require("../../Domain/entities/Status");

const filePath = path.join(
    __dirname,
    "../../../Data/statuses.json"
);

function getAllStatuses() {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
}

function saveStatuses(statuses) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(statuses, null, 2),
        "utf8"
    );
}

function getNextId(statuses) {
    if (statuses.length === 0) {
        return 1;
    }

    return Math.max(...statuses.map(status => status.id)) + 1;
}

function addStatus(statusData) {
    const statuses = getAllStatuses();

    const status = new Status({
        id: getNextId(statuses),
        name: statusData.name
    });

    statuses.push(status);

    saveStatuses(statuses);

    return status;
}

function findStatusById(id) {
    const statuses = getAllStatuses();

    return statuses.find(status => status.id === id) || null;
}

module.exports = {
    getAllStatuses,
    addStatus,
    findStatusById
};