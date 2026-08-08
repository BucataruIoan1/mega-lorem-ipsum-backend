const fs = require("fs");
const path = require("path");
const Category = require("../../Domain/entities/Category");

const filePath = path.join(
    __dirname,
    "../../Data/categories.json"
);

function getAllCategories() {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function getCategoryById(id) {
    const categories = getAllCategories();

    return categories.find(category => category.id === id) || null;
}

function getNextId(categories) {
    if (categories.length === 0) {
        return 1;
    }

    return Math.max(...categories.map(category => category.id)) + 1;
}

function saveCategories(categories) {
    fs.writeFileSync(
        filePath,
        JSON.stringify(categories, null, 2),
        "utf8"
    );
}

function addCategory(categoryData) {
    const categories = getAllCategories();

    const category = new Category({
        id: getNextId(categories),
        name: categoryData.name
    });

    categories.push(category);
    saveCategories(categories);

    return category;
}

function updateCategory(id, categoryData) {
    const categories = getAllCategories();

    const category = categories.find(category => category.id === id);

    if (!category) {
        return null;
    }

    category.name = categoryData.name;

    saveCategories(categories);

    return category;
}

function deleteCategory(id) {
    const categories = getAllCategories();

    const index = categories.findIndex(category => category.id === id);

    if (index === -1) {
        return false;
    }

    categories.splice(index, 1);

    saveCategories(categories);

    return true;
}

module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};