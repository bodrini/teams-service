# Teams Service

A microservice for managing sports teams information and synchronizing statistics (Football, Basketball, NHL). Built with **Node.js (Express)**, **TypeScript**, **Knex.js**, and **MariaDB**.

Fully dockerized development environment with **Hot Reload**, **VS Code Debugging**, and automated **Migrations**.

## 🛠 Tech Stack
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **ORM/Query Builder:** Knex.js
* **Database:** MariaDB
* **Infrastructure:** Docker & Docker Compose
* **Architecture:** Dependency Injection, Repository Pattern
* **Quality Control:** ESLint, Prettier, Husky, Lint-staged

---

## 🚀 Getting Started

### Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) installed
* Node.js (Local) - required for running migration scripts and git hooks
* VS Code (recommended for debugging)

### Installation & Run
1.  **Clone the repository and install dependencies:**
    (Installing local dependencies is required for Git Hooks and Knex CLI to work)
    ```bash
    git clone <repository-url>
    cd teams-service
    npm install
    ```

2.  **Start the infrastructure:**
    ```bash
    docker-compose up --build -d
    ```
    *Note: App runs on port 3000. Database is exposed on host port **3307**.*

3.  **Run Database Migrations:**
    The database starts empty. Since you are running this from your host machine, use the external port:
    ```bash
    DB_HOST=127.0.0.1 DB_PORT=3307 npm run migrate
    ```

The service will be available at **http://localhost:3000**.

---

## 📝 Observability & Logging

This project replaces standard `console.log` with **Pino** for high-performance structured logging.

| Environment | Format | Description |
| :--- | :--- | :--- |
| **Development** | **Pretty Print** | Colorful, human-readable logs via `pino-pretty`. Easy to read in the terminal. |
| **Production** | **JSON** | Structured JSON output suitable for log aggregators (ELK, Datadog, Splunk). |

**Features:**
* **Request Tracking:** Automatically logs every incoming HTTP request (Method, URL, Status Code, Response Time) using `pino-http`.
* **Environment Aware:** Configuration relies on `NODE_ENV` to switch formats automatically.
* **Fail-Fast Config:** The application validates critical environment variables on startup.

## 💾 Database Management (Knex)

We use **Knex.js** for database versioning. Do not manually edit the SQL schema.

| Action | Command | Description |
| :--- | :--- | :--- |
| **Apply Migrations** | `npm run migrate` | Updates database to the latest version (requires env vars if running locally) |
| **Create Migration** | `npm run migrate:make <name>` | Creates a new migration file in `/migrations` |
| **Undo Last Change** | `npm run migrate:rollback` | Reverts the last batch of migrations |

---

## 👮‍♂️ Code Quality & Git Hooks

This project uses **Husky** and **Lint-staged** to ensure code quality.

* **Pre-commit Hook:** Before you commit, the system automatically runs **ESLint** and **Prettier**.
* **Auto-fix:** It will try to fix formatting errors automatically.
* **Blocking:** If there are critical errors, the commit will be blocked until you fix them.

---

## 👨‍💻 Development Workflow

### 🔥 Hot Reload
You don't need to restart the server manually!
* The project uses **Nodemon**.
* Just **save any file** in `src/`, and the server will automatically restart within the Docker container.

### 🐞 Debugging with VS Code
The project is configured for remote debugging inside the container.

1.  Ensure the app is running (`docker-compose up`).
2.  In VS Code, go to **Run and Debug** tab (Ctrl+Shift+D).
3.  Select **"Docker: Attach to Express"** from the dropdown.
4.  Press **F5** (Start Debugging).
5.  Set a breakpoint in your `.ts` files and trigger an API request.

---

## 🔌 API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | **`/teams/sync-football-stats`** | **Fetch & Save Football Stats** |
| **POST** | **`/teams/sync-basketball-stats`** | **Fetch & Save Basketball Stats** |
| **POST** | **`/teams/sync-all-stats`** | **Run sync for Football and Basketball teams** |
| **GET** | **`/teams/nhl-stats-sync`** | **Check & Save NHL results (Islanders)** |
| `GET` | `/teams` | Retrieve list of all teams |
| `POST` | `/teams` | Create a new team manually |
| `PUT` | `/teams/:id` | Fully update a team by ID |
| `PATCH`| `/teams/:id` | Partially update a team by ID |
| `DELETE`| `/teams?id={id}`| Delete a team by ID (query param) |

---

## 📁 Project Structure
* `src/modules/` - Domain logic (Controllers, Services)
* `src/gateways/` - External API integration (NHL, SportsAPI)
* `src/repositories/` - Data access layer (Knex)
* `migrations/` - Knex migration files (Database Schema)
* `docker-compose.yml` - Docker services configuration
* `knexfile.ts` - Database connection configuration
* `.husky/` - Git hooks configuration
