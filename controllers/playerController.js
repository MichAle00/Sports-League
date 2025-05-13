import pool from '../config/db.js';

// Players API routes
app.get('/api/players', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM players');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/players/search', async (req, res) => {
  const searchTerm = req.query.term;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM players WHERE name LIKE ? OR team LIKE ?',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.get('/api/players/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    // Get player info
    const [player] = await pool.query('SELECT * FROM players WHERE id = ?', [playerId]);
    
    if (player.length === 0) {
      return res.status(404).send('Player not found');
    }
    
    // Get player stats (goals, cards, etc.)
    const [stats] = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM goals WHERE player_id = ?) as goals,
        (SELECT COUNT(*) FROM assists WHERE player_id = ?) as assists,
        (SELECT COUNT(*) FROM cards WHERE player_id = ? AND card_type = 'yellow') as yellow_cards,
        (SELECT COUNT(*) FROM cards WHERE player_id = ? AND card_type = 'red') as red_cards
    `, [playerId, playerId, playerId, playerId]);
    
    res.json({
      ...player[0],
      stats: stats[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.post('/api/players', async (req, res) => {
  const { name, team, position, jersey_number, age } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO players (name, team, position, jersey_number, age) VALUES (?, ?, ?, ?, ?)',
      [name, team, position, jersey_number, age]
    );
    const [newPlayer] = await pool.query('SELECT * FROM players WHERE id = ?', [result.insertId]);
    res.status(201).json(newPlayer[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.put('/api/players/:id', async (req, res) => {
  const playerId = req.params.id;
  const { name, team, position, jersey_number, age } = req.body;
  try {
    await pool.query(
      'UPDATE players SET name = ?, team = ?, position = ?, jersey_number = ?, age = ? WHERE id = ?',
      [name, team, position, jersey_number, age, playerId]
    );
    const [updatedPlayer] = await pool.query('SELECT * FROM players WHERE id = ?', [playerId]);
    res.json(updatedPlayer[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/players/:id', async (req, res) => {
  const playerId = req.params.id;
  try {
    await pool.query('DELETE FROM players WHERE id = ?', [playerId]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});