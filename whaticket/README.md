# Whaticket

Whaticket is a comprehensive customer service platform designed to streamline communication and support for businesses. It integrates various messaging channels, allowing agents to manage conversations efficiently from a single interface. This platform is built to enhance customer satisfaction through quick responses and organized support.

## Features

- **Multi-channel Support**: Integrate with WhatsApp, Instagram Direct, and other messaging platforms.
- **Ticket Management**: Organize customer inquiries into tickets for efficient tracking and resolution.
- **Real-time Chat**: Agents can communicate with customers in real-time.
- **User Management**: Create and manage user accounts with different roles and permissions.
- **Queue Management**: Assign tickets to specific queues or agents.
- **Quick Answers**: Pre-defined responses to frequently asked questions to speed up support.
- **Chatbot Integration**: Automate responses and guide customers with intelligent chatbots.
- **Media Sharing**: Send and receive various media types (images, videos, documents).
- **Dashboard Analytics**: Monitor key performance indicators and agent activity.
- **Internationalization**: Support for multiple languages.

## Technologies Used

### Backend
- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web application framework for Node.js.
- **Sequelize**: ORM for database interaction.
- **MySQL**: Relational database management system.
- **Socket.IO**: For real-time, bidirectional event-based communication.
- **WhatsApp Web JS**: Library for WhatsApp integration.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Material-UI**: React component library for a modern design.
- **Axios**: Promise-based HTTP client for the browser and Node.js.
- **React Router**: Declarative routing for React.
- **i18next**: Internationalization framework.

## Setup Instructions

Follow these steps to set up and run Whaticket locally.

### Prerequisites

Make sure you have the following installed:
- Node.js (LTS version recommended)
- npm or Yarn
- MySQL Server
- Docker (optional, for containerized setup)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd whaticket
```

### 2. Backend Setup

Navigate to the `backend` directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env` file by copying `.env.example` and fill in your database credentials and other configurations:

```bash
cp .env.example .env
```

Run database migrations:

```bash
npx sequelize db:migrate
```

Start the backend server:

```bash
npm start
# or
yarn start
```

The backend server will typically run on `http://localhost:8080`.

### 3. Frontend Setup

Open a new terminal and navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
# or
yarn install
```

Create a `.env` file by copying `.env.example` (if it exists, otherwise create it manually) and configure your backend API URL:

```bash
cp .env.example .env
# Example .env content:
# REACT_APP_BACKEND_URL=http://localhost:8080
```

Start the frontend development server:

```bash
npm start
# or
yarn start
```

The frontend application will typically run on `http://localhost:3000`.

### 4. Docker Setup (Optional)

If you prefer to use Docker for a containerized environment, ensure Docker and Docker Compose are installed.

From the root directory of the project:

```bash
docker-compose up --build
```

This will build and start all services defined in `docker-compose.yaml`.

## Usage

Once both the backend and frontend servers are running:

1. Open your web browser and navigate to `http://localhost:3000`.
2. Register a new user or log in with existing credentials.
3. Configure your WhatsApp or other messaging accounts.
4. Start managing customer tickets and communications.

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or support, please open an issue in the repository.