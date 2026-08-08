const {
    getAllCategories,
    addCategory
} = require("../../Infrastructure/repositories/categoryRepository");

function getCategories() {
    return getAllCategories();
}

function createCategory(data) {
    return addCategory(data);
}

module.exports = {
    getCategories,
    createCategory
};