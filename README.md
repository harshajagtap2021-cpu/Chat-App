# Chat Application

A full-stack chat application built with React (Vite) for the frontend and Node.js + Express for the backend.

## Project Structure

```
chat-app/
│
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Chat.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── services/       # API service layer
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   │   └── chatController.js
│   ├── routes/            # API routes
│   │   └── chatRoutes.js
│   ├── data/              # In-memory data storage
│   │   └── messages.js
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

## Features

- User authentication (login with username)
- Real-time message display (polling every 2 seconds)
- Send and receive messages
- Clean, modern UI with gradient background
- Responsive design
- Messages stored in memory (temporary)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-app
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

2. Start the frontend development server (in a new terminal):
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:3000`

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### GET /api/messages
Returns all messages stored in memory.

### POST /api/messages
Creates a new message.

Request body:
```json
{
  "username": "string",
  "text": "string"
}
```

## Tech Stack

### Frontend
- React 18
- Vite
- CSS3

### Backend
- Node.js
- Express
- CORS

## Future Enhancements

- Add WebSocket support for real-time updates
- Implement persistent database (MongoDB/PostgreSQL)
- Add user authentication with JWT
- Implement private messaging
- Add file/image sharing
- Add typing indicators
- Implement message read receipts

## License

ISC
