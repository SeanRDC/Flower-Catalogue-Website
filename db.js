// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Set up the connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});

// Test the connection and create tables
pool.connect(async (err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database.');

    try {
        // Create Favorites table
        await client.query(`
            CREATE TABLE IF NOT EXISTS favorites (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                image TEXT,
                description TEXT,
                dateAdded VARCHAR(255)
            );
        `);

        // Create Collections table
        await client.query(`
            CREATE TABLE IF NOT EXISTS collections (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                image TEXT,
                description TEXT,
                dateAdded VARCHAR(255)
            );
        `);
        console.log('Tables verified/created successfully.');
    } catch (tableErr) {
        console.error('Error creating tables:', tableErr);
    } finally {
        release(); // Release the client back to the pool
    }
});

module.exports = pool;