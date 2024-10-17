document.getElementById('generateSession').addEventListener('click', () => {
    // Generate a unique session identifier (could be a random string or timestamp)
    const sessionId = Date.now(); // Simple unique ID based on timestamp
    const sessionUrl = `http://yourdomain.com/session/${sessionId}`; // http://yourdomain.com/session/${sessionId} with your actual domain and session handling logic.

    // Clear previous QR code
    document.getElementById('qrCode').innerHTML = '';

    // Generate QR Code
    $('#qrCode').qrcode({
        text: sessionUrl,
        width: 128,
        height: 128
    });

    // Show the QR code container
    document.getElementById('qrCodeContainer').style.display = 'block';
});