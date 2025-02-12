import mysql, {PoolOptions, Pool} from "mysql2/promise";

export class MysqlDriver {
    private pool: mysql.Pool;
    constructor(config:any) {
        this.pool = mysql.createPool({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database,
            waitForConnections: true,
            connectionLimit: 10
        });
    }

    async connect() {
        try {
            const [rows] = await this.pool.execute('select 1+1 As Result');
            console.log(rows);
        } catch (error) {
           throw error;
        }    
    }

    async callProcedure(name: string, params = [], isFunction = false) {    
        const placeholders = params.map(() => "?").join(",");
        const query = `CALL ${name}(${placeholders})`;
        
        const [rows] = await this.pool.execute(query, params);
        return Array.isArray(rows) ? rows[0] : rows;
    }

    async close() {
        await this.pool.end();
    }
}