# Project Name

This project aims to connect to the external GitHub API to fetch user data and save it locally. NestJS was used for the backend, and PostgreSQL is used as the database.

## Table of Contents

  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Database Configuration](#database-configuration)
- [Migrations](#migrations)
- [Contributing](#contributing)
- [License](#license)


### Prerequisites

- Node.js (version 18.16.1)
- Docker (version 20.10.23)

### Installation

1. Clone the repository: `git clone https://github.com/your-username/your-project.git`
2. Navigate to the project directory: `cd your-project`
3. Run `docker-compose up -d` to create database container
3. Install dependencies: `npm install`

## Usage

1. Start the server: `npm run start`
2. Access the application in your browser at `http://localhost:3000`


## Migrations

1. To generate the current migrations, run: `npx prisma migrate dev`