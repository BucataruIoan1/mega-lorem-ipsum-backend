const RecordDto = require("../dtos/RecordDto");

function mapRecordToDto(
    record,
    category,
    status,
    owner,
    priority
) {
    return new RecordDto({
        id: record.id,
        content: record.content,
        category: category ? category.name : null,
        status: status ? status.name : null,
        owner: owner ? owner.name : null,
        priority: priority ? priority.name : null,
        lastModified: record.lastModified
    });
}

module.exports = {
    mapRecordToDto
};