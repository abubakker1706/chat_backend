
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT,
    receiver_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES user_table(user_id),
    FOREIGN KEY (receiver_id) REFERENCES user_table(user_id)
);

CREATE TABLE group_chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE group_chat_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    user_id INT,
    FOREIGN KEY (group_id) REFERENCES group_chat(id),
    FOREIGN KEY (user_id) REFERENCES user_table(user_id)
);
CREATE TABLE group_chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_id INT,
    sender_id INT,
    message TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES group_chat(id),
    FOREIGN KEY (sender_id) REFERENCES user_table(user_id)
);