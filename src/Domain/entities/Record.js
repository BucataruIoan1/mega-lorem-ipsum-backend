function getCurrentTime() {
    return new Date().toLocaleTimeString("en-GB", { hour12: false });
}

class Record {
    constructor({
        id,
        content,
        categoryId,
        statusId,
        ownerId,
        priorityId,
        lastModified = getCurrentTime()
    }) {
        this.id = id;
        this.content = content;
        this.categoryId = categoryId;
        this.statusId = statusId;
        this.ownerId = ownerId;
        this.priorityId = priorityId;
        this.lastModified = lastModified;
    }
}

module.exports = Record;
