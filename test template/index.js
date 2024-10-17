const items = [
    { image: 'https://via.placeholder.com/300x200.png?text=Item+1', price: 50 },
    { image: 'https://via.placeholder.com/300x200.png?text=Item+2', price: 75 },
    { image: 'https://via.placeholder.com/300x200.png?text=Item+3', price: 30 },
];

let currentIndex = 0;
let actualPrice;
const itemImage = document.getElementById('itemImage');
const resultMessage = document.getElementById('resultMessage');
const submitGuessButton = document.getElementById('submitGuess');
const nextItemButton = document.getElementById('nextItem');
const startGameButton = document.getElementById('startGame');
const userNameInput = document.getElementById('userName');
const welcomeContainer = document.getElementById('welcomeContainer');
const gameContainer = document.getElementById('gameContainer');
const userDataContainer = document.getElementById('userDataContainer');

// Array to store user data
const userData = [];

startGameButton.addEventListener('click', () => {
    const userName = userNameInput.value.trim();
    if (!userName) {
        alert("Please enter your name to start the game.");
        return;
    }

    // Capture the current date
    const startDate = new Date().toLocaleString();
    
    // Store user data
    userData.push({ name: userName, date: startDate });
    
    // Display user data
    displayUserData();
    
    welcomeContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    displayItem();
});

function displayItem() {
    itemImage.src = items[currentIndex].image;
    actualPrice = items[currentIndex].price;
    document.getElementById('userGuess').value = '';
    resultMessage.textContent = '';
    submitGuessButton.style.display = 'block';
    nextItemButton.style.display = 'none';
}


submitGuessButton.addEventListener('click', () => {
    const userGuess = parseFloat(document.getElementById('userGuess').value);

    if (isNaN(userGuess)) {
        resultMessage.textContent = "Please enter a valid number.";
        return;
    }

    const difference = Math.abs(actualPrice - userGuess);
    
    if (difference === 0) {
        resultMessage.textContent = "Correct! You guessed the exact price!";
    } else if (difference <= 5) {
        resultMessage.textContent = "Very close! The actual price is $" + actualPrice;
    } else {
        resultMessage.textContent = "Not quite! The actual price is $" + actualPrice;
    }

    submitGuessButton.style.display = 'none';
    nextItemButton.style.display = 'inline-block';
});

nextItemButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex < items.length) {
        displayItem();
    } else {
        resultMessage.textContent += " Game over! Thanks for playing!";
        nextItemButton.disabled = true;
    }
});

// Function to display user data
function displayUserData() {
    userDataContainer.innerHTML = '<h2>User Data:</h2>'; // Clear previous entries

    userData.forEach(user => {
        const userEntry = document.createElement('p');
        userEntry.textContent = `Name: ${user.name}, Date: ${user.date}`;
        userDataContainer.appendChild(userEntry);
    });

    userDataContainer.style.display = 'block'; // Show the user data container
}