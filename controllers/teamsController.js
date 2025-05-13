import pool from '../config/db.js';

// Get teams by sport ID
export const getTeamsBySport = async (req, res) => {
	const { sportId } = req.params;
	try {
		const [teams] = await pool.query(
			'SELECT * FROM teams WHERE sport_id = ?',
			[sportId]
		);
		res.json(teams);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

// Add a new team
export const addTeam = async (req, res) => {
	const { sport_id, name, logo } = req.body;
	try {
		const [result] = await pool.query(
			'INSERT INTO teams (sport_id, name, logo) VALUES (?, ?, ?)',
			[sport_id, name, logo]
		);
		res.status(201).json({ id: result.insertId });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const updateTeam = async (req, res) => {
	const { id } = req.params;
	const { name, logo } = req.body;
	try {
		await pool.query(
			'UPDATE teams SET name = ?, logo = ? WHERE id = ?',
			[name, logo, id]
		);
		res.json({ message: "Team updated successfully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteTeam = async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query('DELETE FROM teams WHERE id = ?', [id]);
		res.json({ message: "Team deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	};
};
