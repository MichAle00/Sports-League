import pool from '../config/db.js';

export const getAllMatches = async (req, res) => {
	try {
		const [matches] = await pool.query('SELECT * FROM matches');
		res.json(matches);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getSortedMatches = async (req, res) => {
	try {
		const [matches] = await pool.query('SELECT * FROM from matches ORDER BY DESC');
		res.json(matches);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const getDatedMatches = async (req, res) => {
	const { date } = req.params;
	try {
		await pool.query(
            "SELECT * FROM matches WHERE date = ?", [date]
		);
		res.json({ message: `This are the matches that happened in ${date}`});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};