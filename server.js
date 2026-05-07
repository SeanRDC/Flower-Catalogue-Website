// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.static(path.join(__dirname, ''))); // Serve static HTML, CSS, JS

// ================= API ENDPOINTS =================

// --- FAVORITES ---
// Get all favorites
app.get('/api/favorites', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM favorites');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a favorite
app.post('/api/favorites', async (req, res) => {
    const { name, image, description, dateAdded } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO favorites (name, image, description, dateAdded) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, image, description, dateAdded]
        );
        res.json({ success: true, message: 'Added to favorites', id: result.rows[0].id });
    } catch (err) {
        // Postgres error code 23505 is a unique constraint violation (duplicate entry)
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Already in favorites' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Remove a favorite
app.delete('/api/favorites/:name', async (req, res) => {
    try {
        await pool.query('DELETE FROM favorites WHERE name = $1', [req.params.name]);
        res.json({ success: true, message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- COLLECTIONS ---
// Get all collections
app.get('/api/collections', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM collections');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add to collection
app.post('/api/collections', async (req, res) => {
    const { name, image, description, dateAdded } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO collections (name, image, description, dateAdded) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, image, description, dateAdded]
        );
        res.json({ success: true, message: 'Added to collections', id: result.rows[0].id });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ success: false, message: 'Already in collections' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Remove from collection
app.delete('/api/collections/:name', async (req, res) => {
    try {
        await pool.query('DELETE FROM collections WHERE name = $1', [req.params.name]);
        res.json({ success: true, message: 'Removed from collections' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});