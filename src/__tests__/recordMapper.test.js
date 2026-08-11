const RecordDto = require("../Application/dtos/RecordDto");
const { mapRecordToDto } = require("../Application/mappers/recordMapper");

describe("recordMapper.mapRecordToDto", () => {
    const sampleRecord = {
        id: 42,
        content: "Hello world",
        categoryId: 1,
        statusId: 2,
        ownerId: 3,
        priorityId: 1,
        lastModified: "12:30:00"
    };

    const sampleRelations = {
        category: { id: 1, name: "Work" },
        status: { id: 2, name: "Inactive" },
        owner: { id: 3, name: "Alice" },
        priority: { id: 1, name: "High" }
    };

    test("returnează o instanță de RecordDto cu toate câmpurile mapate corect", () => {
        const result = mapRecordToDto(
            sampleRecord,
            sampleRelations.category,
            sampleRelations.status,
            sampleRelations.owner,
            sampleRelations.priority
        );

        expect(result).toBeInstanceOf(RecordDto);
        expect(result.id).toBe(42);
        expect(result.content).toBe("Hello world");
        expect(result.category).toBe("Work");
        expect(result.status).toBe("Inactive");
        expect(result.owner).toBe("Alice");
        expect(result.priority).toBe("High");
        expect(result.lastModified).toBe("12:30:00");
    });

    test("pune null pentru numele entităților lipsă (când relația nu e găsită)", () => {
        const result = mapRecordToDto(
            sampleRecord,
            null,
            undefined,
            null,
            undefined
        );

        expect(result.category).toBeNull();
        expect(result.status).toBeNull();
        expect(result.owner).toBeNull();
        expect(result.priority).toBeNull();
    });

    test("nu modifică obiectul record original", () => {
        const snapshot = { ...sampleRecord };

        mapRecordToDto(
            sampleRecord,
            sampleRelations.category,
            sampleRelations.status,
            sampleRelations.owner,
            sampleRelations.priority
        );

        expect(sampleRecord).toEqual(snapshot);
    });
});
