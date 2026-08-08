const fs = require("fs");
const path = require("path");
const Priority = require("../../Domain/entities/Priority");

const filePath = path.join(
    __dirname,
    "../../../Data/priorities.json"
);

function getAllPriorities() {
    const data = fs.readFileSync(filePath, "utf8");

    return JSON.parse(data);
}

function savePriorities(priorities) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(priorities, null, 2),
        "utf8"
    );
}

function getNextId(priorities) {
    if (priorities.length === 0) {
        return 1;
    }

    return Math.max(...priorities.map(priority => priority.id)) + 1;
}

function addPriority(priorityData) {
    const priorities = getAllPriorities();

    const priority = new Priority({
        id: getNextId(priorities),
        name: priorityData.name
    });

    priorities.push(priority);

    savePriorities(priorities);

    return priority;
}

function findPriorityById(id) {
    const priorities = getAllPriorities();

    return priorities.find(priority => priority.id === id) || null;
}

module.exports = {
    getAllPriorities,
    addPriority,
    findPriorityById
};