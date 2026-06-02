#!/bin/bash
echo "🌸 Starting Memory Garden..."
echo ""
echo "Starting backend on http://localhost:3001"
cd backend && node server.js &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:5173"
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both servers running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '🌙 Garden closed. Goodnight!'" EXIT

wait
