import { Pool } from 'pg';

const pool = new Pool({
    user: 'quant',
    host: 'localhost',
    database: 'quantdb',
    password: 'quant14',
    port: 5432
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
