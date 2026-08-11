jest.mock("../Infrastructure/repositories/recordRepository");
jest.mock("../Infrastructure/repositories/categoryRepository");
jest.mock("../Infrastructure/repositories/statusRepository");
jest.mock("../Infrastructure/repositories/ownerRepository");
jest.mock("../Infrastructure/repositories/priorityRepository");
jest.mock("../Domain/entities/Record");

const {
    getAllRecords,
    addRecord,
    addRecordsBulk
} = require("../Infrastructure/repositories/recordRepository");

const { getCategoryById } = require("../Infrastructure/repositories/categoryRepository");
const { getStatusById, getAllStatuses } = require("../Infrastructure/repositories/statusRepository");
const { getOwnerById } = require("../Infrastructure/repositories/ownerRepository");
const { getPriorityById, getAllPriorities } = require("../Infrastructure/repositories/priorityRepository");

const {
    getAllRecordDtos,
    createRecord,
    generateLoremRecords
} = require("../Application/services/recordService");

function seedRelations() {
    getCategoryById.mockImplementation(id =>
        id === 1 ? { id: 1, name: "Work" } :
        id === 2 ? { id: 2, name: "Personal" } : null
    );
    getStatusById.mockImplementation(id =>
        id === 1 ? { id: 1, name: "Active" } :
        id === 2 ? { id: 2, name: "Inactive" } : null
    );
    getOwnerById.mockImplementation(id =>
        id === 1 ? { id: 1, name: "Alice" } :
        id === 2 ? { id: 2, name: "Bob" } : null
    );
    getPriorityById.mockImplementation(id =>
        id === 1 ? { id: 1, name: "High" } :
        id === 2 ? { id: 2, name: "Normal" } :
        id === 3 ? { id: 3, name: "Low" } : null
    );
}

function makeRecord(id, overrides = {}) {
    return {
        id,
        content: `Record ${id}`,
        categoryId: 1,
        statusId: 1,
        ownerId: 1,
        priorityId: 1,
        lastModified: `09:0${id % 10}:00`,
        ...overrides
    };
}

beforeEach(() => {
    jest.clearAllMocks();
    seedRelations();
});

describe("recordService.getAllRecordDtos", () => {
    test("fără filtre, returnează toate înregistrările cu meta paginare", () => {
        const records = [
            makeRecord(1),
            makeRecord(2),
            makeRecord(3)
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({ page: 1, pageSize: 10 });

        expect(result.data).toHaveLength(3);
        expect(result.pagination).toEqual({
            page: 1,
            pageSize: 10,
            totalRecords: 3,
            totalPages: 1
        });
        expect(result.data[0]).toHaveProperty("category", "Work");
        expect(result.data[0]).toHaveProperty("status", "Active");
    });

    test("filtrează după categoryId", () => {
        const records = [
            makeRecord(1, { categoryId: 1 }),
            makeRecord(2, { categoryId: 2 }),
            makeRecord(3, { categoryId: 1 })
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({
            page: 1, pageSize: 10, categoryId: 2
        });

        expect(result.data).toHaveLength(1);
        expect(result.data[0].id).toBe(2);
        expect(result.pagination.totalRecords).toBe(1);
    });

    test("filtrează după statusId, ownerId, priorityId în același timp", () => {
        const records = [
            makeRecord(1, { statusId: 1, ownerId: 1, priorityId: 1 }),
            makeRecord(2, { statusId: 2, ownerId: 1, priorityId: 1 }),
            makeRecord(3, { statusId: 1, ownerId: 2, priorityId: 1 }),
            makeRecord(4, { statusId: 1, ownerId: 1, priorityId: 3 }),
            makeRecord(5, { statusId: 1, ownerId: 1, priorityId: 1 })
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({
            page: 1, pageSize: 10,
            statusId: 1, ownerId: 1, priorityId: 1
        });

        expect(result.data.map(r => r.id)).toEqual([1, 5]);
    });

    test("search filtrează după content, category, status, owner, priority", () => {
        const records = [
            makeRecord(1, { content: "banana report" }),
            makeRecord(2, { statusId: 2 }),
            makeRecord(3, { ownerId: 2 }),
            makeRecord(4, { priorityId: 2 }),
            makeRecord(5, { categoryId: 2 })
        ];
        getAllRecords.mockReturnValue(records);

        const r1 = getAllRecordDtos({ page: 1, pageSize: 10, search: "banana" });
        expect(r1.data).toHaveLength(1);
        expect(r1.data[0].id).toBe(1);

        const r2 = getAllRecordDtos({ page: 1, pageSize: 10, search: "inactive" });
        expect(r2.data).toHaveLength(1);
        expect(r2.data[0].id).toBe(2);

        const r3 = getAllRecordDtos({ page: 1, pageSize: 10, search: "bob" });
        expect(r3.data).toHaveLength(1);
        expect(r3.data[0].id).toBe(3);

        const r4 = getAllRecordDtos({ page: 1, pageSize: 10, search: "normal" });
        expect(r4.data).toHaveLength(1);
        expect(r4.data[0].id).toBe(4);

        const r5 = getAllRecordDtos({ page: 1, pageSize: 10, search: "personal" });
        expect(r5.data).toHaveLength(1);
        expect(r5.data[0].id).toBe(5);
    });

    test("sortare ascendentă după id", () => {
        const records = [
            makeRecord(30),
            makeRecord(10),
            makeRecord(20)
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({
            page: 1, pageSize: 10, sortBy: "id", sortDir: "asc"
        });

        expect(result.data.map(r => r.id)).toEqual([10, 20, 30]);
    });

    test("sortare descendentă după status (string, case insensitive)", () => {
        const records = [
            makeRecord(1, { statusId: 1 }),
            makeRecord(2, { statusId: 2 }),
            makeRecord(3, { statusId: 1 })
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({
            page: 1, pageSize: 10, sortBy: "status", sortDir: "desc"
        });

        expect(result.data.map(r => r.status)).toEqual([
            "Inactive", "Active", "Active"
        ]);
    });

    test("fără sortBy păstrează ordinea din sursă", () => {
        const records = [
            makeRecord(3),
            makeRecord(1),
            makeRecord(2)
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({ page: 1, pageSize: 10 });

        expect(result.data.map(r => r.id)).toEqual([3, 1, 2]);
    });

    test("paginare corectă: pagina 2 cu pageSize=2", () => {
        const records = [
            makeRecord(1),
            makeRecord(2),
            makeRecord(3),
            makeRecord(4),
            makeRecord(5)
        ];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({ page: 2, pageSize: 2 });

        expect(result.data.map(r => r.id)).toEqual([3, 4]);
        expect(result.pagination).toEqual({
            page: 2,
            pageSize: 2,
            totalRecords: 5,
            totalPages: 3
        });
    });

    test("pageSize='all' returnează totul cu pagina 1 și corect totalPages", () => {
        const records = [makeRecord(1), makeRecord(2)];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({ page: 1, pageSize: "all" });

        expect(result.data).toHaveLength(2);
        expect(result.pagination).toEqual({
            page: 1,
            pageSize: "all",
            totalRecords: 2,
            totalPages: 1
        });
    });

    test("page depășește totalPages → normalizează la ultima pagină", () => {
        const records = [makeRecord(1), makeRecord(2), makeRecord(3)];
        getAllRecords.mockReturnValue(records);

        const result = getAllRecordDtos({ page: 99, pageSize: 2 });

        expect(result.pagination.page).toBe(2);
        expect(result.data).toHaveLength(1);
        expect(result.data[0].id).toBe(3);
    });

    test("listă goală → page normalizează la 1 și totalPages=0", () => {
        getAllRecords.mockReturnValue([]);

        const result = getAllRecordDtos({ page: 5, pageSize: 10 });

        expect(result.data).toEqual([]);
        expect(result.pagination).toEqual({
            page: 1,
            pageSize: 10,
            totalRecords: 0,
            totalPages: 0
        });
    });
});

describe("recordService.createRecord", () => {
    test("aruncă eroare dacă una din relații lipsește", () => {
        getCategoryById.mockReturnValueOnce(null);

        expect(() => createRecord({
            content: "x",
            categoryId: 99,
            statusId: 1,
            ownerId: 1,
            priorityId: 1
        })).toThrow("Category not found.");
    });

    test("dacă toate relațiile există, apelează addRecord cu datele și returnează rezultatul", () => {
        const payload = {
            content: "Test",
            categoryId: 1,
            statusId: 1,
            ownerId: 1,
            priorityId: 1
        };
        const created = { id: 7, ...payload };
        addRecord.mockReturnValue(created);

        const result = createRecord(payload);

        expect(addRecord).toHaveBeenCalledTimes(1);
        expect(addRecord).toHaveBeenCalledWith(payload);
        expect(result).toEqual(created);
    });
});

describe("recordService.generateLoremRecords", () => {
    test("generează count înregistrări cu statusId și priorityId distribuite ciclic în ordine", () => {
        getAllStatuses.mockReturnValue([
            { id: 2, name: "Inactive" },
            { id: 1, name: "Active" }
        ]);
        getAllPriorities.mockReturnValue([
            { id: 3, name: "Low" },
            { id: 1, name: "High" },
            { id: 2, name: "Normal" }
        ]);
        addRecordsBulk.mockImplementation(arr => arr);

        const result = generateLoremRecords(10);

        expect(result).toHaveLength(10);
        result.forEach(r => {
            expect(r.content).toBe("Lorem");
            expect(r.categoryId).toBe(1);
            expect(r.ownerId).toBe(1);
        });

        const sortedStatusIds = [1, 2];
        const sortedPriorityIds = [1, 2, 3];
        for (let i = 0; i < 10; i++) {
            expect(result[i].statusId).toBe(sortedStatusIds[i % sortedStatusIds.length]);
            expect(result[i].priorityId).toBe(sortedPriorityIds[i % sortedPriorityIds.length]);
        }

        expect(addRecordsBulk).toHaveBeenCalledTimes(1);
        expect(addRecordsBulk).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ statusId: 1, priorityId: 1, content: "Lorem" })
            ])
        );
    });
});
