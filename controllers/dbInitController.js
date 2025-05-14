import pool from '../config/db.js';

export const initDatabase = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check and create sports table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS sports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Check and create teams table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sport_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        logo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE
      )
    `);

        // Check and create players table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        team_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        position VARCHAR(50),
        jersey_number INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
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
