#!/usr/bin/env bash

# WebBlock Full Stack Launcher
# Cleanly terminates any old instances, starts FastAPI AI, Spring Boot Control Plane, and Next.js Frontend

echo "=========================================="
echo "    🚀 STARTING WEBBLOCK MVP PLATFORM     "
echo "=========================================="

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables from Backend/.env
if [ -f "$ROOT_DIR/Backend/.env" ]; then
  echo "Loading environment variables from Backend/.env..."
  set -a
  source "$ROOT_DIR/Backend/.env"
  set +a
fi

# Clean up any stale processes on ports 8000, 8080, 3000
echo "Checking and freeing ports (8000, 8080, 3000)..."
lsof -ti:8000 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

# 1. Start AI Microservice (FastAPI on Port 8000)
echo "[1/3] Starting AI Microservice (FastAPI on port 8000)..."
cd "$ROOT_DIR/Backend/ai-service"
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
AI_PID=$!

# 2. Start Spring Boot Microservice (Port 8080)
echo "[2/3] Starting Spring Boot Control Plane (Port 8080)..."
cd "$ROOT_DIR/Backend/control-plane"
mvn spring-boot:run &
SPRING_PID=$!

# 3. Start Next.js Frontend (Port 3000)
echo "[3/3] Starting Next.js Frontend (Port 3000)..."
cd "$ROOT_DIR/Frontend"
npm run dev &
NEXT_PID=$!

echo "=========================================="
echo "  WebBlock Services Initializing:         "
echo "  - WebBlock Studio: http://localhost:3000"
echo "  - Spring Boot API: http://localhost:8080"
echo "  - AI Microservice: http://localhost:8000"
echo "  - PostgreSQL DB:   webblock_db (Active) "
echo "=========================================="
echo "Press Ctrl+C to stop all services."

cleanup() {
    echo ""
    echo "Stopping all WebBlock services..."
    kill -9 $AI_PID $SPRING_PID $NEXT_PID 2>/dev/null || true
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    exit 0
}

trap cleanup INT TERM EXIT
wait
