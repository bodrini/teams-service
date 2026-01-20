
CREATE DATABASE IF NOT EXISTS sports;
USE sports;

CREATE TABLE IF NOT EXISTS countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country_name VARCHAR(100) NOT NULL
);


CREATE TABLE IF NOT EXISTS sports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sport_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  country_id INT NOT NULL,
  sport_id INT NOT NULL,
  external_team_id VARCHAR(100),
  external_league_id VARCHAR(100),
  FOREIGN KEY (country_id) REFERENCES countries(id),
  FOREIGN KEY (sport_id) REFERENCES sports(id)
);

CREATE TABLE IF NOT EXISTS team_statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,

    external_team_id INT NOT NULL,
    external_league_id INT NOT NULL,
    season INT NOT NULL,

    wins_total INT DEFAULT 0,
    draws_total INT DEFAULT 0,
    loses_total INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_team_stats (external_team_id, external_league_id, season)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO countries (country_name) VALUES ('USA'), ('UK');
INSERT INTO sports (sport_name) VALUES ('Football'), ('Basketball'), ('Hockey');
INSERT INTO teams (name, country_id, sport_id) VALUES
('Arsenal', 2, 1),
('New York Islanders', 1, 3),
('Golden State Warriors', 1, 2);