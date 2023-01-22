import {Pool} from "pg";
import path from "path";
import {migrate} from "postgres-migrations";
import { POOL_CONFIG } from "./constant";

const pool = new Pool(POOL_CONFIG);

export const runMigrations = async ():Promise<void> => {
    let client = await pool.connect();
    try{
        await migrate({client}, path.resolve(__dirname, 'migrations'));
        console.log('Migration successfull!!!')
    } catch (e) {
        console.log('Migration failed with error ', e);
    } finally {
        client.release();
    }
}

export default pool