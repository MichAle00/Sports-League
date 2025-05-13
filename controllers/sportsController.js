import pool from '../config/db.js';

// Get all sports
export const getAllSports = async (req, res) => {
	try {
		const [sports] = await pool.query('SELECT * FROM sports');
		res.json(sports);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

export const addSport = async (req, res) => {
	const { name, image } = req.body;
	try {
		const [result] = await pool.query(
			'INSERT INTO sports (name, image) VALUES (?, ?)',
			[name, image]
		);
		res.status(201).json({ id: result.insertID });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};


export const updateSport = async (req, res) => {
	const { id } = req.params;
	const { name, image } = req.body;
	try {
		await pool.query(
			'UPDATE sports SET name = ?, image = ? WHERE id = ?',
			[name, image, id]
		);
		res.json({ message: "Sport updated successfully" });
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteSport = async (req, res) => {
	const { id } = req.params;
	try {
		await pool.query('DELETE FROM sports WHERE id = ?', [id]);
		res.json({ message: "Sport deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	};
};