import pool from '../config/db.js';

// Teams API routes
export const get_team = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                * 
            FROM 
                teams`);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const spec_team = async (req, res) => {
    const teamId = req.params.id;
    try {
        const [team] = await pool.query(`
            SELECT 
                * 
            FROM 
                teams 
            WHERE 
                team_id = ?`, [teamId]);

        if (team.length === 0) {
            return res.status(404).send('Team not found');
        }

        // Get team players
        const [players] = await pool.query(`
            SELECT 
                * 
            FROM 
                players 
            WHERE 
                team_id = ?`, [team[0].teamId]);

        // Get team stats
        const [stats] = await pool.query(`
        SELECT
            COUNT(*) as matches_played,
        SUM(
            CASE
                WHEN home_team_id = ?
                AND home_score > away_score THEN 1
                WHEN away_team_id = ?
                AND away_score > home_score THEN 1
                ELSE 0
            END
        ) as wins,
        SUM(
            CASE
                WHEN (
                    home_team_id = ?
                    OR away_team = ?
                )
                AND home_score = away_score THEN 1
                ELSE 0
            END
        ) as draws,
        SUM(
            CASE
                WHEN home_team_id = ?
                AND home_score < away_score THEN 1
                WHEN away_team_id = ?
                AND away_score < home_score THEN 1
                ELSE 0
            END
        ) as losses,
        SUM(
            CASE
                WHEN home_team_id = ? THEN home_score
                ELSE away_score
            END
        ) as goals_for,
        SUM(
            CASE
                WHEN home_team_id = ? THEN away_score
                ELSE home_score
            END
        ) as goals_against
        FROM
            matches
        WHERE
        (
            home_team_id = ?
            OR away_team_id = ?
        )
        AND status = 'completed'
    `, Array(10).fill(team[0].teamId));

        res.json({
            ...team[0],
            players,
            stats: stats[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const addTeam = async (req, res) => {
    const { name, city, founded_year, stadium, coach } = req.body;
    try {
        const [result] = await pool.query(`
            INSERT INTO 
                teams (name, city, founded_year, stadium, coach) 
            VALUES 
                (?, ?, ?, ?, ?)`,
            [name, city, founded_year, stadium, coach]
        );
        const [newTeam] = await pool.query(`
            SELECT 
                * 
            FROM 
                teams 
            WHERE 
                team_id = ?`, [result.insertId]);
        res.status(201).json(newTeam[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const upd_team = async (req, res) => {
    const teamId = req.params.id;
    const { name, city, founded_year, stadium, coach } = req.body;
    try {
        await pool.query(`
            UPDATE teams
            SET
                name = ?,
                city = ?,
                founded_year = ?,
                stadium = ?,
                coach = ?
            WHERE
                team_id = ?`,
            [name, city, founded_year, stadium, coach, teamId]
        );
        const [updatedTeam] = await pool.query(`
            SELECT 
                * 
            FROM 
                teams 
            WHERE 
                team_id = ?`, [teamId]);
        res.json(updatedTeam[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

export const del_team = async (req, res) => {
    const teamId = req.params.id;
    try {
        await pool.query(`
            DELETE FROM 
                teams 
            WHERE 
                team_id = ?`, [teamId]);
        res.status(204).send();
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
