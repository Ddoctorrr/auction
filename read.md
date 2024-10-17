Backend Components
User Registration and QR Code Generation:

When users scan the QR code, they should be directed to a registration page where they can enter their name and possibly other details (like email).
Generate a unique QR code for each participant that links to their registration page or a unique identifier.
Item Management:

Store the items (images and actual prices) in a database. This can be done using a simple database like SQLite or a more robust solution like PostgreSQL or MongoDB.
Create an API endpoint to retrieve the current item being displayed, including its image and price.
Price Submission:

Create an API endpoint where users can submit their guesses. This endpoint should accept the user ID (or name) and their guessed price.
Store these guesses in the database along with a timestamp.
Calculating Scores:

After all guesses are submitted, calculate the closest guess to the actual price for each item.
Store the scores for each participant in the database.
Leaderboard:

Create an API endpoint to retrieve the leaderboard, showing the participants and their scores.
This can be displayed on a separate page or in real-time during the event.
Real-time Updates (Optional):

If you want to show real-time updates of scores or guesses, consider using WebSockets or a similar technology to push updates to the frontend.
Example Tech Stack
Backend Framework: Node.js with Express, Python with Flask or Django, or Ruby on Rails.
Database: MongoDB, PostgreSQL, or MySQL.
QR Code Generation: Use libraries like qrcode in Node.js or qrcode in Python to generate QR codes.
Frontend: HTML/CSS/JavaScript for the user interface, possibly using a framework like React or Vue.js for a more dynamic experience.
Example API Endpoints
POST /register: Register a new user and generate a QR code.
GET /item: Retrieve the current item for guessing.
POST /guess: Submit a user's price guess.
GET /leaderboard: Retrieve the current leaderboard.
Example Flow
Before the Event:

Users scan the QR code and register.
They receive a unique identifier.
During the Event:

The host displays an item and its image.
Users submit their guesses via their devices.
After the Event:

Calculate scores based on the guesses.
Display the leaderboard and announce the winner.
Conclusion
This backend setup will allow you to manage the game effectively and provide a seamless experience for your audience. If you need help with specific parts of the implementation, such as coding examples or database design, feel free to ask!