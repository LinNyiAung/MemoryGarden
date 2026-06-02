# 🌸 Memory Garden

A cute website where you and your girlfriend can plant flower memories in a shared garden.
Each flower holds a memory — a text message, a date, and an optional photo.

## Features

- 🌸 **8 flower types**: Rose, Daisy, Tulip, Lavender, Sunflower, Lily, Bluebell, Cosmos
- 👫 **Two adorable avatars** — one for each of you
- 📸 **Photo uploads** — attach a photo to each memory
- 💌 **Memory messages** — write about each special moment
- 🗓️ **Date tracking** — record when the memory happened
- 🌿 **Interactive garden** — click anywhere to plant, click flowers to read
- 💾 **Persistent storage** — all memories saved to a local JSON database
- ✏️ **Custom garden title** — click to rename your garden

## Setup

### Prerequisites
- Node.js 18+
- npm

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Start the Backend Server
```bash
cd backend
npm start
# Runs on http://localhost:3001
```

### 4. Start the Frontend Dev Server
```bash
cd frontend
npm run dev
# Opens on http://localhost:5173
```

### 5. Open in browser
Navigate to **http://localhost:5173**

## How to Use

1. **Enter your names** when you first open the app
2. **Click on your avatar** to select yourself
3. **Click "Plant a Memory"** to enter planting mode
4. **Click anywhere in the garden** to choose where to plant
5. **Choose a flower type** and write your memory
6. **Optionally add a photo** from your phone or computer
7. **Click any flower** in the garden to read its memory

## Project Structure

```
memory-garden/
├── backend/
│   ├── server.js       # Express API + lowdb
│   ├── db.json         # Auto-generated database
│   └── uploads/        # Auto-generated photo storage
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main app
│   │   ├── api.js            # API client
│   │   └── components/
│   │       ├── Avatar.jsx    # Cute SVG avatars
│   │       ├── FlowerSVG.jsx # All 8 flower types
│   │       ├── GardenCanvas.jsx  # Interactive garden
│   │       ├── PlantModal.jsx    # Plant memory flow
│   │       └── MemoryModal.jsx   # View memory
│   └── index.html
└── README.md
```

## Tech Stack

- **Frontend**: React + Vite + Framer Motion
- **Backend**: Node.js + Express
- **Database**: lowdb (JSON file, no setup needed)
- **File Storage**: Local filesystem

Made with 💕
