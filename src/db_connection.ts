import { DataSource } from 'typeorm';

import ormConfig, { config } from './ormconfig';

let dataSource: DataSource | undefined;

export async function getDBConnection(): Promise<DataSource | undefined> {
    if (dataSource !== undefined) {
        return dataSource;
    }

    if (ormConfig === undefined || config === undefined) {
        return undefined;
    }
    dataSource = ormConfig;
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
    return dataSource;
}

export async function getDBConnectionOrThrow(): Promise<DataSource> {
    const connection = await getDBConnection();
    if (connection === undefined) {
        throw new Error('Could not get a DB connection');
    }
    return connection;
}
