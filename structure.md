/auction-game/
│
├── /public/                # Frontend files (host and player)
│   ├── /host/              # Host-specific frontend
│   │   ├── host.html       # Host interface
│   │   ├── host.js         # Host logic
│   │   └── host.css        # Host styling
│   │
│   ├── /player/            # Player-specific frontend
│   │   ├── player.html     # Player interface
│   │   ├── player.js       # Player logic
│   │   └── player.css      # Player styling
│   │
│   ├── /shared/            # Common assets like images, styles
│   │   └── style.css       # Common CSS for the app
│   │
│   └── qr.html             # QR code page (optional)
│
├── /server/                # Backend files
│   ├── server.js           # Node.js WebSocket server
│   ├── db.js               # Database connection and queries (SQL setup)
│   └── config.js           # Configuration file (e.g., database credentials)
│
├── /sql/                   # SQL files (schema setup)
│   └── schema.sql          # SQL script to create the database tables
│
├── package.json            # Node.js package file (with WebSocket, MySQL, etc.)
└── README.md               # Project documentation
