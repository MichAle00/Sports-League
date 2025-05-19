import pool from '../config/db.js';

// Players API routes
export const get_players = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                players.player_id AS id,
                players.full_name AS name,
                players.age,
                teams.name AS team,
                players.position,
                players.jersey_number
            FROM
                players
            INNER JOIN teams ON players.team_id = teams.team_id
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const search = async (req, res) => {
    const searchTerm = req.query.term;
    try {
        const [team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [`%${searchTerm}%`]
        );

        const [rows] = await pool.query(`
            SELECT
                players.player_id,
                players.full_name,
                players.age,
                teams.name,
                players.position,
                players.jersey_number
            FROM
                players
            INNER JOIN teams ON players.team_id = teams.team_id
            WHERE
                players.full_name LIKE ?`,
            [`%${searchTerm}%`]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const search_stats = async (req, res) => {
    const playerId = req.params.id;
    try {
        // Get player info
        const [player] = await pool.query(`
        SELECT
            players.player_id,
            players.full_name,
            players.age,
            teams.name,
            players.position,
            players.jersey_number
        FROM
            players
        INNER JOIN teams ON players.team_id = teams.team_id
        WHERE 
            players.player_id = ?`, [playerId]);

        if (player.length === 0) {
            return res.status(404).send('Player not found');
        }

        // Get player stats (goals, cards, etc.)
        const [stats] = await pool.query(`
        SELECT
        (
            SELECT
                COUNT(*)
            FROM
                events
            WHERE
                player_id = ?
                AND event_type = 'goal'
        ) as goals,
        (
            SELECT
                COUNT(*)
            FROM
                events
            WHERE
                player_id = ?
                AND event_type = 'assist'
        ) as assists,
        (
            SELECT
                COUNT(*)
            FROM
                events
            WHERE
                player_id = ?
                AND event_type = 'yellow'
        ) as yellow_cards,
        (
            SELECT
                COUNT(*)
            FROM
                events
            WHERE
                player_id = ?
                AND event_type = 'red'
        ) as red_cards
    `, [playerId, playerId, playerId, playerId]);

        res.json({
            ...player[0],
            stats: stats[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const add_player = async (req, res) => {
    const { full_name, team, position, jersey_number, age } = req.body;
    try {
        // Get team_id from team name
        const [teamRows] = await pool.query(
            `SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ? LIMIT 1`,
            [team]
        );
        if (!teamRows.length) {
            return res.status(400).json({ error: 'Team not found' });
        }
        const team_id = teamRows[0].team_id;

        // Insert player
        await pool.query(`
            INSERT INTO 
                players (full_name, team_id, position, jersey_number, age)
            VALUES 
                (?, ?, ?, ?, ?)`,
            [full_name, team_id, position, jersey_number, age]
        );

        // Return the new player
        const [newPlayer] = await pool.query(`
            SELECT 
                * 
            FROM 
                players 
            WHERE 
                full_name = ? 
                ORDER BY player_id DESC LIMIT 1`,
            [full_name]
        );
        res.status(201).json(newPlayer[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const update_player = async (req, res) => {
    const playerId = req.params.id;
    const { name, team, position, jersey_number, age } = req.body;
    try {
        const [team_id] = await pool.query(`
            SELECT 
                team_id 
            FROM 
                teams 
            WHERE 
                name = ?`, [team]
        );

        await pool.query(
            `UPDATE 
                players 
            SET 
                full_name = ?, 
                team_id = ?, 
                position = ?, 
                jersey_number = ?, 
                age = ? 
            WHERE 
                player_id = ?`,
            [name, team_id, position, jersey_number, age, playerId]
        );
        const [updatedPlayer] = await pool.query(`
            SELECT
            * 
            FROM 
                players 
            WHERE 
                player_id = ?`, [playerId]);
        res.json(updatedPlayer[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const del_player = async (req, res) => {
    const playerId = req.params.id;
    try {
        await pool.query(`
            DELETE FROM 
                players 
            WHERE 
                player_id = ?`, [playerId]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
