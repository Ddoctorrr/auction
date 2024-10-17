// server.js

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = [];  // To store the connected players
let bids = [];     // To store the bids from players
let gameStarted = false;

// Broadcast message to all connected clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on('connection', ws => {
    console.log('New client connected');

    // Handle messages from clients
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

// Handle player joining
function handlePlayerJoin(data, ws) {
    const { username } = data;

    // Check if username already exists
    if (players.find(player => player.username === username)) {
        ws.send(JSON.stringify({ type: 'error', message: 'username_taken' }));
    } else {
        players.push({ username, ws });
        console.log(`${username} joined the game`);

        // Notify the host of new player
        broadcast({ type: 'player_join', username });

        // Send waiting message to the player
        ws.send(JSON.stringify({ type: 'waiting' }));
    }
}

// Handle host joining
function handleHostJoin(ws) {
    console.log('Host joined the game');
    // Host doesn't need to do anything initially, just wait for players to join
}

// Handle starting the game
function handleStartGame() {
    console.log('Game started');
    gameStarted = true;

    // Broadcast to all players that the game has started
    broadcast({ type: 'start', artworkPrice: '500' });  // Example artwork price
}

// Handle bid submission
function handleBidSubmission(data) {
    const { username, bid } = data;

    // Store the player's bid
    bids.push({ username, value: parseFloat(bid) });
    console.log(`${username} placed a bid of $${bid}`);
}

// Handle refreshing the bids
function handleRefreshBids() {
    console.log('Refreshing bids');
    // Broadcast the current bids to the host
    broadcast({ type: 'bids_update', bids });
}

// Handle revealing the price and calculating results
function handleRevealPrice(data) {
    const { correctPrice, results } = data;
    console.log(`Revealing correct price: $${correctPrice}`);

    // Broadcast the results to all players
    results.forEach(result => {
        const player = players.find(p => p.username === result.username);
        if (player) {
            player.ws.send(JSON.stringify({
                type: 'result',
                yourBid: result.value,
                correctPrice,
                ranking: `Points: ${result.points}`
            }));
        }
    });
}
