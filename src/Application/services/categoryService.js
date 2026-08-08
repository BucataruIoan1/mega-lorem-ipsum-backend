const {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
} = require("../../Infrastructure/repositories/categoryRepository");

const {
    getAllRecords
} = require("../../Infrastructure/repositories/recordRepository");

function getCategories() {
    return getAllCategories();
}

function getCategory(id) {
    return getCategoryById(id);
}

function createCategory(data) {
    return addCategory(data);
}

function editCategory(id, data) {
    return updateCategory(id, data);
}

function removeCategory(id) {
    const category = getCategoryById(id);

    if (!category) {
        return {
            deleted: false,
            notFound: true
        };
    }

    const records = getAllRecords();

    const isUsed = records.some(record =>
        record.categoryId === id
    );

    if (isUsed) {
        return {
            deleted: false,
            inUse: true
        };
    }

    deleteCategory(id);

    return {
        deleted: true
    };
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    editCategory,
    removeCategory
};