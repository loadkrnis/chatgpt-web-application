var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "post", // Will use table name `post` as default behaviour.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        title: {
            type: "varchar",
        },
        text: {
            type: "text",
        },
    },
    relations: {
        categories: {
            target: "category",
            type: "many-to-many",
            joinTable: true,
            cascade: true,
        },
    },
})
