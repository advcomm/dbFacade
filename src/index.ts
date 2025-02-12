import { MysqlDriver } from "./drivers/mysqlDriver";
import { PostgresDriver } from "./drivers/PostgresDriver";

export interface DatabaseConfig {
    type: "postgres" | "mysql";
    host: string;
    user: string;
    password: string;
    database?: string;
    port?: number;
}

export class DatabaseFacade {
    private static config: DatabaseConfig;
    private static db: any;

    static initialize(config: DatabaseConfig) {
        if (!DatabaseFacade.db) {
            DatabaseFacade.config = config;
            DatabaseFacade.db = DatabaseFacade.createDriver(config);
            DatabaseFacade.verifyConnection();
        }
    }

    private static createDriver(config: DatabaseConfig) {
        switch (config.type) {
            case "mysql":
                return new MysqlDriver(config);
            case "postgres":
                return new PostgresDriver(config);
            default:
                throw new Error(`Unsupported database type: ${config.type}`);
        }
    }

    private static async verifyConnection() {
        try {
            await DatabaseFacade.db.connect();
            console.log("Database connection established successfully.");
        } catch (error) {
            console.error("Failed to establish database connection:", error);
            throw error;
        }
    }

    static async callProcedure(name: string, params: any[] = [], isFunction = false) {
        return await DatabaseFacade.db.callProcedure(name, params, isFunction);
    }

    static async close() {
        return await DatabaseFacade.db.close();
    }
}