var EntitySchema = require("typeorm").EntitySchema

module.exports = new EntitySchema({
    name: "user", // Will use table name `post` as default behaviour.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "varchar",
        },
        password: {
            type: "varchar",
        },
    },
    relations: {
        // categories: {
        //     target: "category",
        //     type: "many-to-many",
        //     joinTable: true,
        //     cascade: true,
        // },
    },
})
