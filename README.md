# Teams Service (Node.js + TypeScript + MariaDB)

This microservice aggregates information about sports teams from different tables and exposes it via a REST API.

## Installation

- Install Docker and Docker Compose
- Clone the repository and navigate to its directory

Run:

```bash
docker-compose up --build
```

MariaDB will be automatically initialized with the base schema from init.sql.

## API Endpoints

All requests are served under the /api/teams prefix.

- GET /teams — Retrieve aggregated data about teams
- POST /teams — Create a new team
- PUT /teams/:id — Fully update a team by ID
- PATCH /teams/:id — Partially update a team by ID
- DELETE /teams?id={id} — Delete a team by ID (provided as a query parameter)



