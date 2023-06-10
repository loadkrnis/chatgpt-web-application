var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "post", // Will use table name `post` as default behaviour.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int",
        },
        request: {
            type: "text",
        },
        response: {
            type: "text",
        },
        model: {
            type: "varchar",
        }
    },
})
