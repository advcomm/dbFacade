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


    /// <summary>
    /// Call a stored procedure or function in the database
    /// </summary>  
    /// <param name="name">The name of the stored procedure or function</param>
    /// <param name="params">The parameters to pass to the stored procedure or function</param>
    /// <param name="isFunction">True if the stored procedure is a function, false if it is a procedure</param>
    /// <returns>The result of the stored procedure or function</returns>
    static async callProcedure(name: string, params: any[] = [], isFunction = false) {
        return await DatabaseFacade.db.callProcedure(name, params, isFunction);
    }

    /// <summary>
    /// Listen to a channel for notifications  (Postgres only)
    /// </summary>
    /// <param name="channel">The channel to listen to</param>  
    /// <param name="callback">The callback function to execute when a message is received</param>
    /// <returns>void</returns>
    static async ListenToChannel(channel: string, callback: (message: any) => void) {
        return await DatabaseFacade.db.ListenToChannel(channel, callback);
    }

    static async close() {
        return await DatabaseFacade.db.close();
    }
}