USE auction_game;

-- Table for users (players and hosts)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('host', 'player') NOT NULL,
    score INT DEFAULT 0
);

-- Table for bids
CREATE TABLE bids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    bid_value DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
