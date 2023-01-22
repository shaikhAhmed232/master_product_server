import {PoolConfig} from "pg";
import { getEnvVar } from "../helper";

export const POOL_CONFIG:PoolConfig = {
    host: getEnvVar('PG_HOST'),
    port: +getEnvVar('PG_PORT'),
    database: getEnvVar('PG_DB'),
    user: getEnvVar('PG_USER'),
    password: getEnvVar('PG_PASSWORD')
};