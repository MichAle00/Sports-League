import pool from '../config/db.js';

// Top Scorers
export const top_scorers = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.team, COUNT(g.id) as goals
      FROM players p
      LEFT JOIN goals g ON p.id = g.player_id
      GROUP BY p.id
      ORDER BY goals DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Top Assists
export const top_assists = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.team, COUNT(a.id) as assists
      FROM players p
      LEFT JOIN assists a ON p.id = a.player_id
      GROUP BY p.id
      ORDER BY assists DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Most Cards
export const most_cards = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.team, 
             SUM(CASE WHEN c.card_type = 'yellow' THEN 1 ELSE 0 END) as yellow_cards,
             SUM(CASE WHEN c.card_type = 'red' THEN 1 ELSE 0 END) as red_cards,
             COUNT(c.id) as total_cards
      FROM players p
      LEFT JOIN cards c ON p.id = c.player_id
      GROUP BY p.id
      ORDER BY total_cards DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Team Standings
export const team_standings = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        team,
        COUNT(*) as matches_played,
        SUM(CASE WHEN home_score > away_score THEN 1 ELSE 0 END) as wins,
        SUM(CASE WHEN home_score = away_score THEN 1 ELSE 0 END) as draws,
        SUM(CASE WHEN home_score < away_score THEN 1 ELSE 0 END) as losses,
        SUM(home_score) as goals_for,
        SUM(away_score) as goals_against,
        SUM(home_score) - SUM(away_score) as goal_difference,
        SUM(CASE 
              WHEN home_score > away_score THEN 3 
              WHEN home_score = away_score THEN 1 
              ELSE 0 
            END) as points
      FROM (
        SELECT home_team as team, home_score, away_score FROM matches
        UNION ALL
        SELECT away_team as team, away_score, home_score FROM matches
      ) as combined
      GROUP BY team
      ORDER BY points DESC, goal_difference DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Recent Matches
export const recent_matches = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, home_team, away_team, home_score, away_score, match_date, status
      FROM matches
      ORDER BY match_date DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};