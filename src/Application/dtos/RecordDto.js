class RecordDto {
    constructor({
        id,
        content,
        category,
        status,
        owner,
        priority,
        lastModified
    }) {
        this.id = id;
        this.content = content;
        this.category = category;
        this.status = status;
        this.owner = owner;
        this.priority = priority;
        this.lastModified = lastModified;
    }
}

module.exports = RecordDto;