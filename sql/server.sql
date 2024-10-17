// server.js with MySQL integration

const WebSocket = require('ws');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // Replace with your MySQL username
    password: '',        // Replace with your MySQL password
    database: 'auction_game'
});

// Connect to MySQL
connection.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to the database.');
});

const wss = new WebSocket.Server({ port: 8080 });

let gameStarted = false;

// Broadcast message to all clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Handle WebSocket connection
wss.on('connection', ws => {
    console.log('New client connected');

    ws.on('message', message => {
        const data = JSON.parse(message);

        switch (data.type) {
            case 'join':
                handlePlayerJoin(data, ws);
                break;
            case 'host_join':
                handleHostJoin(ws);
                break;
            case 'start_game':
                handleStartGame();
                break;
            case 'refresh_bids':
                handleRefreshBids();
                break;
            case 'bid':
                handleBidSubmission(data);
                break;
            case 'reveal_price':
                handleRevealPrice(data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Handle player joining and store in database
function handlePlayerJoin(data, ws) {
    const { username } = data;

    // Check if username exists in the database
    connection.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                // Username already taken
                ws.send(JSON.stringify({ type: 'error', message: 'username_taken' }));
            } else {
                // Insert new player into the database
                connection.query(
                    'INSERT INTO users (username, role) VALUES (?, "player")',
                    [username],
                    (err, result) => {
                        if (err) throw err;

                        console.log(`${username} joined the game`);

                        // Notify host of new player
                        broadcast({ type: 'player_join', username });

                        // Send waiting message to the player
                        ws.send(JSON.stringify({ type: 'waiting' }));
                    }
                );
            }
        }
    );
}

// Handle bid submission and store in database
function handleBidSubmission(data) {
    const { username, bid } = data;

    // Find user ID by username
    connection.query(
        'SELECT id FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                const userId = results[0].id;

                // Store the bid in the database
                connection.query(
                    'INSERT INTO bids (user_id, bid_value) VALUES (?, ?)',
                    [userId, parseFloat(bid)],
                    (err, result) => {
                        if (err) throw err;

                        console.log(`${username} placed a bid of $${bid}`);
                    }
                );
            }
        }
    );
}

// Handle revealing the price
function handleRevealPrice(data) {
    const { correctPrice, results } = data;
    console.log(`Revealing correct price: $${correctPrice}`);

    // Update the scores in the database based on the result
    results.forEach(result => {
        connection.query(
            'UPDATE users SET score = score + ? WHERE username = ?',
            [result.points, result.username],
            (err, res) => {
                if (err) throw err;
            }
        );
    });

    // Broadcast the results to all players
    results.forEach(result => {
        broadcast({
            type: 'result',
            username: result.username,
            bid: result.value,
            diff: result.diff,
            points: result.points
        });
    });
}
