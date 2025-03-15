# Invoice and Daily Sales Report System

This project consists of two microservices:
1. Invoice Service: Handles invoice creation and generates daily sales reports
2. Email Service: Consumes daily sales reports and sends them via email

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- MongoDB
- RabbitMQ

## Project Structure

```
.
├── docker-compose.yml
├── invoice-service/
│   ├── src/
│   │   ├── invoice/
│   │   ├── report/
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
└── email-service/
    ├── src/
    │   ├── email/
    │   ├── app.module.ts
    │   └── main.ts
    ├── Dockerfile
    ├── package.json
    └── tsconfig.json
```

## Setup and Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-service
```

2. Install dependencies for both services:
```bash
cd invoice-service && npm install
cd ../email-service && npm install
```

3. Configure environment variables:
- Create `.env` files in both service directories with the following variables:

For invoice-service:
```env
MONGODB_URI=mongodb://root:example@mongodb:27017/invoice?authSource=admin
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

For email-service:
```env
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

4. Start the services using Docker Compose:
```bash
docker-compose up --build
```

## API Endpoints

### Invoice Service (http://localhost:3000)

- `POST /invoices` - Create a new invoice
  ```json
  {
    "customer": "John Doe",
    "amount": 100,
    "reference": "INV001",
    "date": "2024-01-01T00:00:00.000Z",
    "items": [
      {
        "sku": "SKU001",
        "qt": 2
      }
    ]
  }
  ```

- `GET /invoices` - Get all invoices
- `GET /invoices/:id` - Get a specific invoice
- `GET /invoices/range?startDate=2024-01-01&endDate=2024-01-02` - Get invoices within a date range

## Features

1. Invoice Creation:
   - Create invoices with customer details, amount, and items
   - Store invoices in MongoDB
   - RESTful API for invoice management

2. Daily Sales Report:
   - Automatically generates daily sales reports at 12:00 PM
   - Calculates total sales and item-wise quantities
   - Publishes reports to RabbitMQ queue

3. Email Service:
   - Consumes reports from RabbitMQ queue
   - Sends formatted email reports
   - Configurable email settings

## Testing

Run tests for each service:

```bash
# In invoice-service directory
npm test

# In email-service directory
npm test
```

## Architecture

The system uses a microservices architecture with:
- NestJS for both services
- MongoDB for invoice storage
- RabbitMQ for message queuing
- Docker for containerization
- Jest for testing

## Error Handling

- Both services include comprehensive error handling
- Failed operations are logged
- RabbitMQ ensures message persistence
- Email sending retries on failure

## Monitoring

- Console logging for important operations
- RabbitMQ management interface (http://localhost:15672)
- MongoDB logs

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 