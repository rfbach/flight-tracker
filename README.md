# Flight Tracker

A real-time flight tracking application that displays live flight information, allowing users to search and monitor flights by flight number or route.

## Quick Start

### Local Development

```bash
npm install
npm start
```

Then open `http://localhost:4200` in your browser.

### Deploy to AWS

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions to AWS S3 with HTTPS via CloudFront.

Quick deploy:
```bash
# Configure your .env file first (see DEPLOYMENT.md)
./deploy.ps1
```

## Development

```bash
# Run tests
npm test

# Build for production
npm run build
```

## Architecture

- **Frontend**: Angular 21 with TypeScript
- **Testing**: Vitest
- **Deployment**: AWS S3 + CloudFront (HTTPS)
- **Mock API**: Built-in mock data for development

## Documentation

- [Deployment Guide](./DEPLOYMENT.md) - Complete setup and deployment instructions
- [Quick Start](./QUICKSTART.md) - 5-minute quick reference
