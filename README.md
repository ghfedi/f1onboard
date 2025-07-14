## Overview
F1-Onboard is a real-time Formula 1 dashboard application that provides telemetry and timing data visualization for F1 races. The application consists of a Next.js frontend and a Rust backend, offering various features for F1 enthusiasts to track and analyze race data.

## Core Goals
1. Provide real-time visualization of Formula 1 race data
2. Display comprehensive telemetry information for all drivers
3. Enable comparison between drivers' performance
4. Support both live race tracking and historical race replay
5. Offer an intuitive and responsive user interface
6. Ensure accurate and reliable data processing

## Functional Requirements

### Data Acquisition
- Connect to official F1 data sources
- Record and save race sessions for later replay
- Process telemetry data in real-time
- Handle data streaming with minimal latency

### Race Information Display
- Show current leaderboard with positions and gaps
- Display lap times and sector information
- Visualize tire usage and strategy
- Show DRS (Drag Reduction System) status
- Present weather conditions and track information
- Display race control messages and flags

### Driver-Specific Features
- Show detailed driver information
- Visualize car metrics (speed, RPM, gear, etc.)
- Display pedal inputs
- Show mini-sector performance
- Track tire history and current tire status
- Compare drivers' performance in battle mode

### User Interface
- Provide responsive design for different screen sizes
- Support different viewing modes (dashboard, battle, etc.)
- Allow customization of displayed information
- Ensure accessibility for users with disabilities

## Technical Requirements

### Frontend
- Use Next.js for the web application
- Implement real-time updates using WebSockets
- Ensure responsive and performant UI
- Support modern browsers

### Backend
- Use Rust for performance-critical components
- Implement efficient data processing
- Provide WebSocket server for real-time communication
- Support API endpoints for schedule and historical data

### Development and Deployment
- Support containerized deployment with Docker
- Implement CI/CD pipelines
- Ensure code quality through testing
- Follow best practices for security

## Deployment

### Docker Deployment
The application supports automated Docker deployment to Docker Hub using GitHub Actions. For detailed instructions on setting up and using the Docker deployment workflow, see [Docker Deployment Guide](docs/docker-deployment.md).

Key features:
- Automated building and pushing of Docker images to Docker Hub
- Support for multiple environments (development, staging, production)
- Production-ready Docker Compose configuration
- Comprehensive tagging strategy for different branches and releases

## Constraints
- Must handle high-frequency data updates
- Should work with limited network bandwidth
- Must respect Formula 1's intellectual property rights
- Should be usable on various devices and screen sizes
