import pool from '../config/db.js';

// Match operations
export const getAllMatches = async (req, res) => {
    try {
      const [matches] = await pool.query(`
        SELECT m.*, 
          t1.logo_url as home_logo, 
          t2.logo_url as away_logo
        FROM matches m
        LEFT JOIN teams t1 ON m.home_team = t1.name
        LEFT JOIN teams t2 ON m.away_team = t2.name
        ORDER BY m.match_date DESC
      `);
      res.json(matches);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const getMatchById = async (req, res) => {
    try {
      const [match] = await pool.query(`
        SELECT m.*, 
          t1.logo_url as home_logo, 
          t2.logo_url as away_logo
        FROM matches m
        LEFT JOIN teams t1 ON m.home_team = t1.name
        LEFT JOIN teams t2 ON m.away_team = t2.name
        WHERE m.id = ?
      `, [req.params.id]);
      
      if (match.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
      
      res.json(match[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const createMatch = async (req, res) => {
    const { home_team, away_team, match_date, location } = req.body;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO matches 
        (home_team, away_team, match_date, location, status) 
        VALUES (?, ?, ?, ?, 'scheduled')`,
        [home_team, away_team, match_date, location]
      );
      
      const [newMatch] = await pool.query('SELECT * FROM matches WHERE id = ?', [result.insertId]);
      res.status(201).json(newMatch[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const updateMatch = async (req, res) => {
    const { home_score, away_score, status } = req.body;
    
    try {
      await pool.query(
        `UPDATE matches SET 
        home_score = ?, away_score = ?, status = ? 
        WHERE id = ?`,
        [home_score, away_score, status, req.params.id]
      );
      
      const [updatedMatch] = await pool.query('SELECT * FROM matches WHERE id = ?', [req.params.id]);
      res.json(updatedMatch[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const deleteMatch = async (req, res) => {
    try {
      await pool.query('DELETE FROM matches WHERE id = ?', [req.params.id]);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Team operations
export const getAllTeams = async (req, res) => {
    try {
      const [teams] = await pool.query(`
        SELECT t.*, 
          COUNT(p.id) as player_count,
          (SELECT COUNT(*) FROM matches 
           WHERE (home_team = t.name OR away_team = t.name) 
           AND status = 'completed') as matches_played
        FROM teams t
        LEFT JOIN players p ON t.name = p.team
        GROUP BY t.id
      `);
      res.json(teams);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const getTeamById = async (req, res) => {
    try {
      // Get team info
      const [team] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
      
      if (team.length === 0) {
        return res.status(404).json({ error: 'Team not found' });
      }
      
      // Get players
      const [players] = await pool.query(`
        SELECT p.*, 
          (SELECT COUNT(*) FROM goals WHERE player_id = p.id) as goals,
          (SELECT COUNT(*) FROM assists WHERE player_id = p.id) as assists
        FROM players p
        WHERE p.team = ?
      `, [team[0].name]);
      
      // Get recent matches
      const [matches] = await pool.query(`
        SELECT * FROM matches 
        WHERE (home_team = ? OR away_team = ?)
        ORDER BY match_date DESC
        LIMIT 5
      `, [team[0].name, team[0].name]);
      
      res.json({
        ...team[0],
        players,
        recent_matches: matches
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const createTeam = async (req, res) => {
    const { name, city, founded_year, stadium, coach, logo_url } = req.body;
    
    try {
      const [result] = await pool.query(
        `INSERT INTO teams 
        (name, city, founded_year, stadium, coach, logo_url) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [name, city, founded_year, stadium, coach, logo_url]
      );
      
      const [newTeam] = await pool.query('SELECT * FROM teams WHERE id = ?', [result.insertId]);
      res.status(201).json(newTeam[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const updateTeam = async (req, res) => {
    const { name, city, founded_year, stadium, coach, logo_url } = req.body;
    
    try {
      await pool.query(
        `UPDATE teams SET 
        name = ?, city = ?, founded_year = ?, stadium = ?, coach = ?, logo_url = ? 
        WHERE id = ?`,
        [name, city, founded_year, stadium, coach, logo_url, req.params.id]
      );
      
      const [updatedTeam] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
      res.json(updatedTeam[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

export const deleteTeam = async (req, res) => {
    try {
    	await pool.query('DELETE FROM teams WHERE id = ?', [req.params.id]);
    	res.status(204).send();
    } catch (err) {
      	console.error(err);
    	res.status(500).json({ error: 'Server error' });
	}
}

  // Statistics operations
export const getStandings = async (req, res) => {
    try {
    	const [standings] = await pool.query(`
        	SELECT 
          	t.name,
          	t.logo_url,
          	COUNT(*) as matches_played,
          	SUM(CASE WHEN m.home_team = t.name AND m.home_score > m.away_score THEN 1
                WHEN m.away_team = t.name AND m.away_score > m.home_score THEN 1
               	ELSE 0 END) as wins,
          		SUM(CASE WHEN m.home_score = m.away_score THEN 1 ELSE 0 END) as draws,
          		SUM(CASE WHEN m.home_team = t.name AND m.home_score < m.away_score THEN 1
                   WHEN m.away_team = t.name AND m.away_score < m.home_score THEN 1
                   ELSE 0 END) as losses,
          		SUM(CASE WHEN m.home_team = t.name THEN m.home_score ELSE m.away_score END) as goals_for,
          		SUM(CASE WHEN m.home_team = t.name THEN m.away_score ELSE m.home_score END) as goals_against,
          		SUM(CASE WHEN m.home_team = t.name AND m.home_score > m.away_score THEN 3
                   WHEN m.away_team = t.name AND m.away_score > m.home_score THEN 3
                   WHEN m.home_score = m.away_score THEN 1
                   ELSE 0 END) as points
        	FROM matches m
        	JOIN teams t ON t.name = m.home_team OR t.name = m.away_team
        	WHERE m.status = 'completed'
        	GROUP BY t.name
        	ORDER BY points DESC, goals_for - goals_against DESC
      `);
      
      res.json(standings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
	}
}

export const getTopScorers = async (req, res) => {
    try {
      const [scorers] = await pool.query(`
        SELECT 
          p.id,
          p.name,
          p.team,
          t.logo_url as team_logo,
          COUNT(g.id) as goals
        FROM players p
        LEFT JOIN goals g ON p.id = g.player_id
        LEFT JOIN teams t ON p.team = t.name
        GROUP BY p.id
        ORDER BY goals DESC
        LIMIT 10
      `);
      
      res.json(scorers);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
	}
}

export const getRecentMatches = async (req, res) => {
	try {
    	const [matches] = await pool.query(`
    	SELECT 
        m.*,
        t1.logo_url as home_logo,
        t2.logo_url as away_logo
    	FROM matches m
    	LEFT JOIN teams t1 ON m.home_team = t1.name
    	LEFT JOIN teams t2 ON m.away_team = t2.name
    	ORDER BY m.match_date DESC
    	LIMIT 5
    `);
      
    res.json(matches);
	} catch (err) {
    	console.error(err);
    	res.status(500).json({ error: 'Server error' });
	}
}