import {DataSource} from "typeorm"
import * as schema from "../models"
import config from "../../../config"


export const db = new DataSource({
    type: "postgres",
    host: "localhost",
    url: config.postgresURL,
    database: "test",
    entities: [schema.User, schema.Project, schema.Run, schema.Model, schema.Dataset],
    logging: false,
    synchronize: true,
    cache: true,
    logger: "advanced-console"
})

export const GCPStorage = {
    keyFilename: config.gcpCredentials,
    projectId: "automl-platform",
};
