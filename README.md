# **Invoice and Daily Sales Report System**

## **Overview**

This project is a backend system that allows users to create and manage invoices. It also generates a daily sales report and sends it via email automatically at 12:00 PM. The system is built using **NestJS**, **MongoDB**, and **RabbitMQ**, with support for **Docker**.

---

## **Features**

- **Invoice Management**:
  - Create, retrieve, and filter invoices via RESTful APIs.
- **Daily Sales Report**:
  - Automatically calculates and generates a daily sales summary report at 12:00 PM.
  - Publishes the report to a RabbitMQ queue for email sending.
- **Email Sending**:
  - Consumes sales report messages and sends them via email (mocked).

---

## **Tech Stack**

- **Backend Framework**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Message Queue**: [RabbitMQ](https://www.rabbitmq.com/)
- **Testing**: Jest & Supertest
- **Containerization**: Docker & Docker Compose

---

## **Prerequisites**

- Node.js (v16 or higher)
- Docker and Docker Compose
- MongoDB Compass (optional, for GUI database management)

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <repository_url>
cd invoice-service
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start Docker Containers**

Make sure Docker is running, then start the required services:

```bash
docker-compose up -d
```

This will:

- Start a MongoDB container on port `27017`.
- Start a RabbitMQ container on ports `5672` (for messages) and `15672` (for RabbitMQ Management UI).

### **4. Run the Application**

Start the NestJS application in development mode:

```bash
npm run start:dev
```

---

## **REST API Endpoints**

### **Base URL**: `http://localhost:3000`

### **1. Create Invoice**

- **Endpoint**: `POST /invoices`
- **Body**:
  ```json
  {
    "customer": "John Doe",
    "amount": 150,
    "reference": "INV-001",
    "items": [
      { "sku": "ITEM001", "qt": 2 },
      { "sku": "ITEM002", "qt": 3 }
    ]
  }
  ```
- **Response**:
  ```json
  {
    "_id": "invoice_id",
    "customer": "John Doe",
    "amount": 150,
    "reference": "INV-001",
    "items": [
      { "sku": "ITEM001", "qt": 2 },
      { "sku": "ITEM002", "qt": 3 }
    ],
    "date": "2025-01-10T00:00:00.000Z"
  }
  ```

### **2. Get Invoice by ID**

- **Endpoint**: `GET /invoices/:id`
- **Response**:
  ```json
  {
    "_id": "invoice_id",
    "customer": "John Doe",
    "amount": 150,
    "reference": "INV-001",
    "items": [
      { "sku": "ITEM001", "qt": 2 },
      { "sku": "ITEM002", "qt": 3 }
    ],
    "date": "2025-01-10T00:00:00.000Z"
  }
  ```

### **3. Get All Invoices**

- **Endpoint**: `GET /invoices`
- **Query Parameters** (optional):
  - `startDate`: Filter invoices created on or after this date.
  - `endDate`: Filter invoices created on or before this date.
- **Response**:
  ```json
  [
    {
      "_id": "invoice_id",
      "customer": "John Doe",
      "amount": 150,
      "reference": "INV-001",
      "items": [
        { "sku": "ITEM001", "qt": 2 },
        { "sku": "ITEM002", "qt": 3 }
      ],
      "date": "2025-01-10T00:00:00.000Z"
    }
  ]
  ```

---

## **Testing**

### **1. Run Unit Tests**

```bash
npm run test
```

### **2. Run Integration Tests**

```bash
npm run test:e2e
```

### **3. Test Coverage**

To view test coverage:

```bash
npm run test:cov
```

---

## **RabbitMQ Management**

### **Access RabbitMQ UI**

- URL: `http://localhost:15672`
- Default Credentials:
  - **Username**: `guest`
  - **Password**: `guest`

---

## **Project Structure**

```
src
├── app.module.ts            # Main application module
├── invoices/                # Invoice module
│   ├── invoices.controller.ts   # REST API endpoints
│   ├── invoices.service.ts      # Business logic
│   ├── schemas/             # Mongoose schemas
│   └── invoices.module.ts       # Module definition
├── daily-summary/            # Email consumer service (RabbitMQ)
│   ├── daily-summary.service.ts  # Consumes RabbitMQ messages
│   ├── daily-summary.module.ts   # Module definition
```

---

## **Docker Compose Services**

```yaml
version: '3.8'
services:
  mongo:
    image: mongo
    container_name: mongodb
    ports:
      - '27017:27017'
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    ports:
      - '5672:5672'
      - '15672:15672'
```

---

## **Planned Features**

- Email sending via SendGrid.
- Advanced filtering for invoices.
- Retry mechanism for RabbitMQ messages.

---
