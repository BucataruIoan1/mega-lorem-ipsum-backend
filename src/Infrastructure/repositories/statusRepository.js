const fs = require("fs");
const path = require("path");
const Status = require("../../Domain/entities/Status");

const filePath = path.join(
    __dirname,
    "../../Data/statuses.json"
);

function getAllStatuses() {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
}

function getStatusById(id) {
    const statuses = getAllStatuses();

    return statuses.find(status => status.id === id) || null;
}

function getNextId(statuses) {
    if (statuses.length === 0) {
        return 1;
    }

    return Math.max(...statuses.map(status => status.id)) + 1;
}

function saveStatuses(statuses) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(statuses, null, 2),
        "utf8"
    );
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

function updateStatus(id, statusData) {
    const statuses = getAllStatuses();

    const status = statuses.find(status => status.id === id);

    if (!status) {
        return null;
    }

    status.name = statusData.name;

    saveStatuses(statuses);

    return status;
}

function deleteStatus(id) {
    const statuses = getAllStatuses();

    const index = statuses.findIndex(status => status.id === id);

    if (index === -1) {
        return false;
    }

    statuses.splice(index, 1);

    saveStatuses(statuses);

    return true;
}

module.exports = {
    getAllStatuses,
    getStatusById,
    addStatus,
    updateStatus,
    deleteStatus
};