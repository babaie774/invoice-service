# **Invoice and Daily Sales Report System**

This project provides a microservices-based system for managing invoices and generating daily sales summaries. It uses **NestJS**, **MongoDB**, **RabbitMQ**, and **Docker Compose** to ensure scalability and reliability.

---

## **Features**

1. **Invoice Management**:

   - Create and retrieve invoices with customer details, total amount, and itemized data.

2. **Daily Sales Report**:

   - Automatically generates a summary of daily sales at a scheduled time.
   - Publishes the report to RabbitMQ for further processing.

3. **Email Notifications**:
   - Sends the daily sales summary as an email (mock implementation).

---

## **Quick Start Guide**

### **1. Start Services**

Run the following command in the project root directory:

```bash
docker-compose up --build
```

Services will start with the following configurations:

- **Invoice Service**: [http://localhost:3000](http://localhost:3000)
- **Report Service**: [http://localhost:3001](http://localhost:3001)
- **Email Service**: [http://localhost:3002](http://localhost:3002)
- **RabbitMQ UI**: [http://localhost:15672](http://localhost:15672) (User: `guest`, Pass: `guest`)

---

### **2. API Endpoints**

#### **Invoice Service (Port 3000)**

1. **Create Invoice**

   - **POST** `/invoices`
   - Example:
     ```bash
     curl -X POST http://localhost:3000/invoices -H "Content-Type: application/json" -d '{
       "customer": "John Doe",
       "amount": 100.5,
       "reference": "INV001",
       "items": [{"sku": "item1", "qt": 2}, {"sku": "item2", "qt": 1}]
     }'
     ```

2. **Fetch All Invoices**

   - **GET** `/invoices`
   - Example:
     ```bash
     curl -X GET http://localhost:3000/invoices
     ```

3. **Fetch Invoice by ID**
   - **GET** `/invoices/:id`
   - Example:
     ```bash
     curl -X GET http://localhost:3000/invoices/INVOICE_ID
     ```

---

### **3. Logs**

Monitor all service logs:

```bash
docker-compose logs -f
```

---

### **4. Shut Down**

Stop all running containers:

```bash
docker-compose down
```

---

## **Testing**

To run unit and integration tests:

1. Stop Docker services if running.
2. Install dependencies and run tests for each service:
   ```bash
   npm install
   npm test
   ```

---

## **Project Structure**

- **Invoice Service**: Manages invoice creation and retrieval.
- **Report Service**: Generates daily sales summaries and sends them to RabbitMQ.
- **Email Service**: Consumes RabbitMQ messages and processes email notifications.

---

## **Technology Stack**

- **NestJS**: Backend framework.
- **MongoDB**: Database for storing invoices.
- **RabbitMQ**: Message broker for inter-service communication.
- **Docker Compose**: Containerized environment for services.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit changes:
   ```bash
   git commit -m "Add your message"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## **License**

This project is licensed under the **MIT License**.
