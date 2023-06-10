var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "category", // Will use table name `category` as default behaviour.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar",
        },
    },
})
