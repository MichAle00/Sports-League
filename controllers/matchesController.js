import pool from '../config/db.js';

export const getAllMatches = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                * 
            FROM
                matches 
            ORDER BY   
                date DESC
            `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const getMatchById = async (req, res) => {
    try {
        const [rows] = await pool.query(`
        SELECT 
            m.match_id,
            m.date,
            home.name AS home_team_name,
            away.name AS away_team_name,
            m.home_score,
            m.away_score,
            m.stadium,
            m.status
        FROM 
            matches m
        JOIN 
            teams home ON m.home_team_id = home.team_id
        JOIN 
            teams away ON m.away_team_id = away.team_id
        WHERE 
            match_id = ?`, [req.params.id]);
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
        const [home_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [home_team]
        );

        const [away_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [away_team]
        );

        const [result] = await pool.query(`
        INSERT INTO
            matches (
                home_team_id,
                away_team_id,
                date,
                stadium,
                home_score,
                away_score,
                status
            )
        VALUES
            (?, ?, ?, ?, ?, ?, ?)`,
            [home_team_id, away_team_id, match_date, location, home_score || 0, away_score || 0, status || 'scheduled']
        );

        const [newMatch] = await pool.query(`
            SELECT 
                * 
            FROM 
                matches 
            WHERE 
                match_id = ?`, [result.insertId]);
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
        const [home_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [home_team]
        );

        const [away_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [away_team]
        );

        await pool.query(`
            UPDATE 
                matches 
            SET 
                home_team_id = ?,
                away_team_id = ?, 
                date = ?, 
                stadium = ?, 
                home_score = ?, 
                away_score = ?, 
                status = ? 
            WHERE 
                match_id = ?`,
            [home_team_id, away_team_id, match_date, location, home_score, away_score, status, matchId]
        );

        const [updatedMatch] = await pool.query(`
            SELECT 
                * 
            FROM 
                matches 
            WHERE 
                match_id = ?`, [matchId]);
        res.json(updatedMatch[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const deleteMatch = async (req, res) => {
    try {
        await pool.query(`
            DELETE FROM 
                matches
            WHERE
                match_id = ?`, [req.params.id]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}

export const searchMatches = async (req, res) => {
    const searchTerm = req.query.term;

    try {
        /*const [home_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [`%${searchTerm}%`, , ]
        );

        const [away_team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [, `%${searchTerm}%`, ]
        );*/

        const [rows] = await pool.query(`
        SELECT 
            m.match_id,
            m.date,
            home.name AS home_team_name,
            away.name AS away_team_name,
            m.home_score,
            m.away_score,
            m.stadium,
            m.status
        FROM 
            matches m
        JOIN 
            teams home ON m.home_team_id = home.team_id
        JOIN 
            teams away ON m.away_team_id = away.team_id
        WHERE 
            home_team_name LIKE ? 
        OR 
            away_team_name LIKE ? 
        OR 
            stadium LIKE ?
        ORDER BY 
            m.date DESC`,
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
}
