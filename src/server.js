const express = require("express");
const categoryApi = require("./API/categoryApi");
const ownerApi = require("./API/ownerApi");
const priorityApi = require("./API/priorityApi");
const recordApi = require("./API/recordApi");
const statusApi = require("./API/statusApi");

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Mega Lorem Ipsum API is running"
    });
});

app.use("/api/records", recordApi);
app.use("/api/categories", categoryApi);
app.use("/api/statuses", statusApi);
app.use("/api/priorities", priorityApi);
app.use("/api/owners", ownerApi);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
