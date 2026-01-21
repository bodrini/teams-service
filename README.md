# Teams Service

A microservice for managing sports teams information. Built with **Node.js (Express)**, **TypeScript**, and **MariaDB**.

Fully dockerized development environment with **Hot Reload** and **VS Code Debugging** support.

## 🛠 Tech Stack
* **Runtime:** Node.js (v18+)
* **Framework:** Express.js
* **Language:** TypeScript
* **Database:** MariaDB
* **Infrastructure:** Docker & Docker Compose
* **Dev Tools:** Nodemon, ts-node

---

## 🚀 Getting Started

### Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop/) installed
* VS Code (recommended for debugging)

### Installation & Run
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd teams-service
    ```
2.  Start the application:
    ```bash
    docker-compose up --build
    ```

The service will be available at **http://localhost:3000**.
MariaDB will be automatically initialized with the schema from `init.sql`.

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
| `GET` | `/teams` | Retrieve list of all teams |
| `POST` | `/teams` | Create a new team manually |
| **`POST`** | **`/teams/sync-stats`** | **Fetch external stats & save to DB (Upsert)** |
| `PUT` | `/teams/:id` | Fully update a team by ID |
| `PATCH`| `/teams/:id` | Partially update a team by ID |
| `DELETE`| `/teams?id={id}`| Delete a team by ID (query param) |

---

## 📁 Project Structure
* `src/` - Source code (TypeScript)
* `docker-compose.yml` - Docker services configuration
* `init.sql` - Database initialization script
* `.vscode/launch.json` - Debugger configuration



