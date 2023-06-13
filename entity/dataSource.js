const typeorm = require("typeorm");

exports.dataSource = new typeorm.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    synchronize: true,
    entities: [require("./Post"), require("./Category"), require("./User")],
    charset: "utf8mb4",
});
