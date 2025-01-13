@echo off
echo Starting setup...

REM Step 1: Pull required Docker images
echo Pulling Docker images...
docker-compose pull

REM Step 2: Build and start the application
echo Building and starting the application...
docker-compose up --build -d

REM Step 3: Wait for services to start
echo Waiting for services to start...
timeout /t 10 >nul

REM Step 4: Print status
echo Setup complete. Services are running.
echo Access Invoice Service at: http://localhost:3000
echo Access RabbitMQ Management UI at: http://localhost:15672 (username: guest, password: guest)
