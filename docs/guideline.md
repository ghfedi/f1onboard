# F1-Onboard Developer Guidelines

## Project Overview

F1-Onboard is a real-time Formula 1 dashboard application that provides telemetry and timing data visualization for F1 races. The application consists of a Next.js frontend and a Rust backend, offering various features for F1 enthusiasts to track and analyze race data.

### Core Goals
1. Provide real-time visualization of Formula 1 race data
2. Display comprehensive telemetry information for all drivers
3. Enable comparison between drivers' performance
4. Support both live race tracking and historical race replay
5. Offer an intuitive and responsive user interface
6. Ensure accurate and reliable data processing

## Architecture

### Frontend Architecture
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time Updates**: WebSocket connections

The frontend is organized into the following key directories:
- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable React components
- `/context`: React Context providers for state management
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and helpers
- `/styles`: Global styles and Tailwind configuration
- `/types`: TypeScript type definitions

### Backend Architecture
- **Language**: Rust
- **Crates**:
  - `api`: API endpoints for the frontend
  - `client`: Client library for interacting with F1 data sources
  - `data`: Data processing and storage
  - `env`: Environment configuration
  - `live`: Real-time data streaming via WebSockets
  - `saver`: Saving race data for replay
  - `simulator`: Simulating race data for testing/demo

### Data Flow
1. F1 data is acquired from official sources by the `client` crate
2. Data is processed by the `data` crate
3. Processed data is streamed to the frontend via WebSockets by the `live` crate
4. The frontend receives data through the `SocketContext` and updates the UI accordingly
5. Historical data is accessed via API endpoints provided by the `api` crate

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- Rust (latest stable)
- Docker and Docker Compose (for containerized development)

### Frontend Setup
1. Navigate to the `/dash` directory
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup
1. Install Rust dependencies:
   ```
   cargo build
   ```
2. Run the backend services:
   ```
   cargo run --bin live
   cargo run --bin api
   ```

### Docker Setup
1. Build and run all services using Docker Compose:
   ```
   docker-compose up --build
   ```

## Development Workflow

### Feature Development Process
1. Create a new branch from `main` for your feature
2. Implement the feature with appropriate tests
3. Submit a pull request for review
4. Address review feedback
5. Merge to `main` once approved

### Code Organization Guidelines
- Keep components focused on a single responsibility
- Use TypeScript interfaces for all data structures
- Implement proper error handling
- Add comments for complex logic
- Follow the established project structure

### State Management
- Use React Context for global state
- Use local component state for UI-specific state
- Consider performance implications when updating context state

## Code Standards and Best Practices

### TypeScript
- Use proper typing for all variables, functions, and components
- Avoid using `any` type
- Create interfaces for all data structures
- Use type guards for type narrowing

### React
- Use functional components with hooks
- Implement React.memo for performance-critical components
- Use useCallback and useMemo for optimizing re-renders
- Keep components small and focused

### CSS/Styling
- Use Tailwind CSS for styling
- Create reusable component styles
- Ensure responsive design for all components
- Follow mobile-first approach

### Rust
- Follow Rust idioms and best practices
- Use proper error handling with Result and Option types
- Implement comprehensive testing
- Document public APIs

## Testing Approach

### Frontend Testing
- Use Jest for unit testing
- Implement React Testing Library for component tests
- Create end-to-end tests for critical user flows
- Test responsive behavior across different screen sizes

### Backend Testing
- Implement unit tests for all Rust modules
- Create integration tests for API endpoints
- Test WebSocket server functionality
- Implement performance tests for data processing

## Deployment Process

### Containerization
- All services are containerized using Docker
- Docker Compose is used for local development
- Production deployment uses individual containers

### CI/CD Pipeline
- Automated testing on pull requests
- Code quality checks (linting, formatting)
- Automated deployment to staging environments
- Production deployment after manual approval

### Monitoring and Logging
- Implement structured logging
- Set up monitoring for application performance
- Configure alerts for critical issues

## Performance Considerations

### Frontend Performance
- Optimize component re-renders
- Implement virtualization for long lists
- Use code splitting for better initial load performance
- Optimize image loading

### Backend Performance
- Optimize WebSocket message format
- Implement data compression for network transfers
- Add caching for frequently accessed data
- Optimize database queries

## Security Guidelines

### Data Protection
- Implement secure WebSocket connections (WSS)
- Add input validation for all user inputs
- Implement proper CORS configuration
- Follow security best practices

### Authentication (if implemented)
- Use secure authentication methods
- Implement proper session management
- Secure API endpoints with authentication

## Contribution Guidelines

### Pull Request Process
1. Ensure all tests pass
2. Update documentation as needed
3. Follow code style guidelines
4. Request review from appropriate team members

### Issue Reporting
- Use the issue tracker for bug reports and feature requests
- Provide detailed steps to reproduce bugs
- Include relevant information (browser, OS, etc.)

## Resources and Documentation

### Project Documentation
- README.md: Project overview and setup instructions
- docs/requirements.md: Detailed project requirements
- docs/plan.md: Project improvement plan
- docs/tasks.md: Actionable improvement tasks

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Rust Documentation](https://doc.rust-lang.org/book/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
