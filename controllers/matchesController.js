import pool from '../config/db.js';

export const getAllMatches = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM matches ORDER BY match_date DESC');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const getMatchById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM matches WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).send('Match not found');
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const createMatch = async (req, res) => {
    const { home_team, away_team, match_date, location, home_score, away_score, status } = req.body;

    try {
        const [result] = await pool.query(
            'INSERT INTO matches (home_team, away_team, match_date, location, home_score, away_score, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [home_team, away_team, match_date, location, home_score || 0, away_score || 0, status || 'scheduled']
        );

        const [newMatch] = await pool.query('SELECT * FROM matches WHERE id = ?', [result.insertId]);
        res.status(201).json(newMatch[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const updateMatch = async (req, res) => {
    const matchId = req.params.id;
    const { home_team, away_team, match_date, location, home_score, away_score, status } = req.body;

    try {
        await pool.query(
            'UPDATE matches SET home_team = ?, away_team = ?, match_date = ?, location = ?, home_score = ?, away_score = ?, status = ? WHERE id = ?',
            [home_team, away_team, match_date, location, home_score, away_score, status, matchId]
        );

        const [updatedMatch] = await pool.query('SELECT * FROM matches WHERE id = ?', [matchId]);
        res.json(updatedMatch[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const deleteMatch = async (req, res) => {
    try {
        await pool.query('DELETE FROM matches WHERE id = ?', [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const searchMatches = async (req, res) => {
    const searchTerm = req.query.term;

    try {
        const [rows] = await pool.query(
            `SELECT * FROM matches 
       WHERE home_team LIKE ? OR away_team LIKE ? OR location LIKE ?
       ORDER BY match_date DESC`,
            [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}
