// player.js

// DOM elements
const loginScreen = document.getElementById('login-screen');
const waitingScreen = document.getElementById('waiting-screen');
const biddingScreen = document.getElementById('bidding-screen');
const resultScreen = document.getElementById('result-screen');

const usernameForm = document.getElementById('username-form');
const errorMessage = document.getElementById('error-message');
const bidForm = document.getElementById('bid-form');

const artworkPrice = document.getElementById('artwork-price');
const yourBid = document.getElementById('your-bid');
const correctPrice = document.getElementById('correct-price');
const ranking = document.getElementById('ranking');

let socket; // WebSocket connection
let username;

// Handle username submission
usernameForm.addEventListener('submit', function (event) {
    event.preventDefault();
    username = document.getElementById('username').value;

    if (username) {
        // Connect to the server via WebSocket
        socket = new WebSocket('ws://localhost:8080'); // Adjust to your server address

        socket.onopen = () => {
            // Send the username to the server
            socket.send(JSON.stringify({ type: 'join', username }));
        };

        socket.onmessage = function (message) {
            const data = JSON.parse(message.data);

            if (data.type === 'error' && data.message === 'username_taken') {
                // If username is taken, show error message
                errorMessage.style.display = 'block';
            } else if (data.type === 'waiting') {
                // Move to the waiting screen
                loginScreen.style.display = 'none';
                waitingScreen.style.display = 'block';
            } else if (data.type === 'start') {
                // Game has started, show bidding screen
                waitingScreen.style.display = 'none';
                biddingScreen.style.display = 'block';
                artworkPrice.textContent = data.artworkPrice;
            } else if (data.type === 'result') {
                // Display results after bidding
                biddingScreen.style.display = 'none';
                resultScreen.style.display = 'block';
                yourBid.textContent = data.yourBid;
                correctPrice.textContent = data.correctPrice;
                ranking.textContent = data.ranking;
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
});

// Handle bid submission
bidForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const bid = document.getElementById('bid').value;

    if (bid && socket) {
        // Send the bid to the server
        socket.send(JSON.stringify({ type: 'bid', username, bid }));
    }
});
