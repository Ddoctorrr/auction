// host.js

// DOM elements
const hostLoginScreen = document.getElementById('host-login-screen');
const hostWaitingScreen = document.getElementById('host-waiting-screen');
const hostBiddingScreen = document.getElementById('host-bidding-screen');
const hostResultScreen = document.getElementById('host-result-screen');

const hostLoginForm = document.getElementById('host-login-form');
const playerList = document.getElementById('player-list');
const bidList = document.getElementById('bid-list');
const scoreboard = document.getElementById('scoreboard');

const startGameButton = document.getElementById('start-game');
const refreshBidsButton = document.getElementById('refresh-bids');
const revealPriceButton = document.getElementById('reveal-price');

let socket;
let hostUsername;
let players = [];
let bids = [];

// Handle host login
hostLoginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    hostUsername = document.getElementById('host-username').value;

    if (hostUsername) {
        // Connect to the server via WebSocket
        socket = new WebSocket('ws://localhost:8080'); // Adjust to your server address

        socket.onopen = () => {
            // Notify the server that the host has joined
            socket.send(JSON.stringify({ type: 'host_join', hostUsername }));
        };

        socket.onmessage = function (message) {
            const data = JSON.parse(message.data);

            if (data.type === 'player_join') {
                // Add new player to the player list
                players.push(data.username);
                updatePlayerList();
            } else if (data.type === 'bids_update') {
                // Update bids list from players
                bids = data.bids;
                updateBidList();
            } else if (data.type === 'game_start') {
                // Show the bidding screen
                hostWaitingScreen.style.display = 'none';
                hostBiddingScreen.style.display = 'block';
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Show the waiting screen after login
        hostLoginScreen.style.display = 'none';
        hostWaitingScreen.style.display = 'block';
    }
});

// Function to update the player list in the UI
function updatePlayerList() {
    playerList.innerHTML = ''; // Clear the list
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = player;
        playerList.appendChild(li);
    });
}

// Function to update the bid list in the UI
function updateBidList() {
    bidList.innerHTML = ''; // Clear the list
    bids.forEach(bid => {
        const li = document.createElement('li');
        li.textContent = `${bid.username}: $${bid.value}`;
        bidList.appendChild(li);
    });
}

// Handle starting the game
startGameButton.addEventListener('click', function () {
    // Notify the server to start the game
    if (socket) {
        socket.send(JSON.stringify({ type: 'start_game' }));
    }
});

// Handle refreshing the bids
refreshBidsButton.addEventListener('click', function () {
    // Notify the server to refresh the bids from the players
    if (socket) {
        socket.send(JSON.stringify({ type: 'refresh_bids' }));
    }
});

// Handle revealing the price and calculating the results
revealPriceButton.addEventListener('click', function () {
    const correctPrice = prompt('Entrez le prix correct de l\'œuvre (en $):');

    if (correctPrice && socket) {
        // Calculate the difference for each bid and sort the results
        bids.forEach(bid => {
            bid.diff = Math.abs(correctPrice - bid.value);
        });

        // Sort bids by the closest to the correct price
        bids.sort((a, b) => a.diff - b.diff);

        // Assign points: 100 for first, 50 for second, 10 for third
        bids.forEach((bid, index) => {
            if (index === 0) bid.points = 100;
            else if (index === 1) bid.points = 50;
            else if (index === 2) bid.points = 10;
            else bid.points = 0;
        });

        // Send the result to the server
        socket.send(JSON.stringify({
            type: 'reveal_price',
            correctPrice,
            results: bids
        }));

        // Update the scoreboard
        updateScoreboard(correctPrice);
    }
});

// Function to update the scoreboard in the UI
function updateScoreboard(correctPrice) {
    hostBiddingScreen.style.display = 'none';
    hostResultScreen.style.display = 'block';
    scoreboard.innerHTML = `<li>Prix correct: $${correctPrice}</li>`; // Add correct price

    bids.forEach(bid => {
        const li = document.createElement('li');
        li.textContent = `${bid.username}: $${bid.value} (Différence: ${bid.diff}, Points: ${bid.points})`;
        scoreboard.appendChild(li);
    });
}
