import pool from '../config/db.js';

export const initDatabase = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        await connection.query(`
      CREATE TABLE IF NOT EXISTS stadiums (
        stadium_id INT AUTO_INCREMENT PRIMARY KEY,
        team_id INT NOT NULL,
        name VARCHAR(30) NOT NULL,
        construction_year YEAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (team_id) REFERENCES teams(team_id)
      )
    `);
        // Check and create events table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        match_id INT NOT NULL,
        player_id INT,
        event_type ENUM('goal', 'yellow', 'red', 'assist') NOT NULL,
        minute INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        FOREIGN KEY (match_id) REFERENCES matches(match_id),
        FOREIGN KEY (player_id) REFERENCES players(player_id)
      )
    `);

        await connection.query(`
      CREATE TABLE IF NOT EXISTS matches (
        match_id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        home_team_id INT NOT NULL,
        away_team_id INT NOT NULL,
        home_score INT DEFAULT 0,
        away_score INT DEFAULT 0,
        stadium_id INT NOT NULL,
        FOREIGN KEY (home_team_id) REFERENCES teams(team_id),
        FOREIGN KEY (away_team_id) REFERENCES teams(team_id),
        FOREIGN KEY (stadium_id) REFERENCES stadiums(stadium_id)
      )
    `);

        // Check and create teams table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS teams (
        team_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        city VARCHAR(30) NOT NULL,
        founded_year YEAR NOT NULL,
        stadium VARCHAR(30),
        coach VARCHAR(30) NOT NULL,
        logo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      )
    `);

        // Check and create players table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS players (
        player_id INT AUTO_INCREMENT PRIMARY KEY,
        team_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        position ENUM('goalkeeper', 'midfielder', 'defense', 'striker') NOT NULL,
        jersey_number INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(team_id)
      )
    `);

        await connection.commit();

        res.json({
            success: true,
            message: 'Database tables initialized successfully!'
        });
    } catch (error) {
        await connection.rollback();
        console.error('Database initialization failed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initialize database: ' + error.message
        });
    } finally {
        connection.release();
    }
};
