const fs = require("fs");
const path = require("path");
const Category = require("../../Domain/entities/Category");

const filePath = path.join(
    __dirname,
    "../../../Data/categories.json"
);

function getAllCategories() {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

function getNextId(categories) {
    if (categories.length === 0) {
        return 1;
    }

    return Math.max(...categories.map(category => category.id)) + 1;
}

function addCategory(categoryData) {
    const categories = getAllCategories();

    const category = new Category({
        id: getNextId(categories),
        name: categoryData.name
    });

    categories.push(category);

    fs.writeFileSync(
        filePath,
        JSON.stringify(categories, null, 2),
        "utf8"
    );

    return category;
}

function findCategoryById(id) {
    const categories = getAllCategories();

    return categories.find(category => category.id === id) || null;
}

module.exports = {
    getAllCategories,
    addCategory,
    findCategoryById
};