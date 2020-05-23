import { createConnection } from "typeorm";

export const connection = createConnection({
    type: "postgres",
    host: "ec2-54-246-90-10.eu-west-1.compute.amazonaws.com",
    port:  5432,
    username: "ovsphfdxhwedif",
    password: "4e21ec9c1a8655abf852a131865520e9d07c4ed05f22f9c015597895da14e51f",
    database: "db10qat7l73pcr",
    ssl: { rejectUnauthorized : false },
    entities: ["src/entity/**/*.ts"],
    migrations: ["src/migration/**/*.ts"],
    synchronize: true,
    logging: false
})
