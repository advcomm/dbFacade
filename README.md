# DatabaseFacade

`DatabaseFacade` is a simple and unified interface for interacting with different types of databases. It currently supports MySQL and PostgreSQL.

## Installation

To use `DatabaseFacade`, you need to have the required database drivers installed. You can install them using npm:

```bash
npm install mysql2 postgres
```

## Usage

Here is a basic example of how to use `DatabaseFacade` in your application:

```typescript
import { DatabaseFacade, DatabaseConfig } from './src/index';

// Define your database configuration
const config: DatabaseConfig = {
    type: 'mysql', // or 'postgres'
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database',
    port: 3306 // or the port your database is running on
};

// Initialize the DatabaseFacade
DatabaseFacade.initialize(config);

// Example of calling a stored procedure
async function callMyProcedure() {
    try {
        const result = await DatabaseFacade.callProcedure('my_procedure_name', [param1, param2]);
        console.log('Procedure result:', result);
    } catch (error) {
        console.error('Error calling procedure:', error);
    }
}

// Close the database connection when done
async function closeConnection() {
    try {
        await DatabaseFacade.close();
        console.log('Database connection closed.');
    } catch (error) {
        console.error('Error closing connection:', error);
    }
}

// Call the procedure and close the connection
callMyProcedure().then(closeConnection);
```

## API

### `DatabaseFacade.initialize(config: DatabaseConfig)`

Initializes the database connection with the provided configuration.

### `DatabaseFacade.callProcedure(name: string, params: any[] = [], isFunction = false)`

Calls a stored procedure or function with the given name and parameters.

### `DatabaseFacade.close()`

Closes the database connection.

## Configuration

The `DatabaseConfig` interface defines the configuration options for the database connection:

```typescript
export interface DatabaseConfig {
    type: 'postgres' | 'mysql';
    host: string;
    user: string;
    password: string;
    database?: string;
    port?: number;
}
```

## License

This project is licensed under the MIT License.