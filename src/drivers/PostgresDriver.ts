import { Pool, QueryResult } from 'pg';

export class PostgresDriver {
    private sql: Pool;
    constructor(config:any) {
        this.sql = new Pool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            port: config.port || 5432
        });
    }


    async connect() {
        try {
            const res = await this.sql.query(`select 1+1 As Result`);
            console.log(res.rows);
        } catch (error) {
            throw error;
        }    
    }

    async callProcedure(name: string, params: any[] = [], isFunction = false) {
        if (!isFunction) {
                const result= await this.sql.query(`CALL ${name}(${params.map((_, i) => `$${i + 1}`).join(', ')})`, params);
                return result.rows;
        } else {
            // Stored Function: SELECT * FROM syntax
            const result= await this.sql.query(`SELECT * FROM ${name}(${params.map((_, i) => `$${i + 1}`).join(', ')})`, params);
            return result.rows; 
        }
    }

    async ListenToChannel(channel: string, callback: (message: any) => void) {
        const client = await this.sql.connect();
        await client.query(`LISTEN ${channel}`);
        client.on("notification", async (message: any) => {
            callback(message);
        });
    }

    async close() {
        await this.sql.end();
    }
}
