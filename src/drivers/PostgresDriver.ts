import postgres from "postgres";

export class PostgresDriver {
    private sql: any;
    constructor(config:any) {
        this.sql = postgres({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 5432
        });
    }


    async connect() {
        try {
            const res = await this.sql`select 1+1 As Result`;
            console.log(res);
        } catch (error) {
            throw error;
        }    
    }

    async callProcedure(name: string, params = [], isFunction = false) {
        if (!isFunction) {
            // Stored Procedure: CALL syntax
            await this.sql`CALL ${this.sql(name)}(${this.sql(params)})`;
            return { success: true }; // Procedures return no result set
        } else {
            // Stored Function: SELECT * FROM syntax
            return await this.sql`SELECT * FROM ${this.sql(name)}(${this.sql(params)})`;
        }
    }

    async close() {
        await this.sql.end();
    }
}
