# HBnB — Phase 4: Full-Stack Application (Master)

**AirBnB Clone · Phase 4 of 4 — Capstone**

This is the final phase of the ALX **HBnB** progression. Integrates every layer built across the previous three phases—domain models, Flask, REST API, static assets—and extends them with a **MySQL database**, **SQLAlchemy ORM**, **Swagger documentation**, a **dynamic JavaScript front end**, and **user credential handling**.

---

## The Four-Phase Progression

HBnB is intentionally split across four phases. Each phase adds a production concern while reusing the domain model introduced in Phase 1.

```
Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4
 Console     Flask       REST API    MySQL + JS + Auth
 JSON        Jinja2      CRUD        SQLAlchemy
 Static CSS  Templates   Blueprints  Swagger
```

| Phase | Project | Deliverables | Key Technologies |
|-------|------------|----------------|------------------|
| 1 | [AirBnB_clone](https://github.com/mgn-dev/AirBnB_clone) | Domain model, command interpreter, JSON persistence, static HTML/CSS prototype | Python OOP, `cmd`, `uuid`, `json`, HTML5, CSS |
| 2 | [AirBnB_clone_v2](https://github.com/mgn-dev/AirBnB_clone_v2) | HTTP routes, URL parameters, server-rendered pages | Flask, Jinja2, Fabric deploy |
| 3 | [AirBnB_clone_v3](https://github.com/mgn-dev/AirBnB_clone_v3) | Versioned JSON API with full CRUD for every resource | Flask Blueprints, REST, Flask-CORS |
| **4 — current phase** | `AirBnB_clone_v4` | Persistent relational storage, API docs, interactive UI, auth | MySQL, SQLAlchemy, Flasgger, jQuery/AJAX, MD5 password hashing |

### Skills Trajectory

| Concern | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|---------|---------|---------|---------|---------|
| Data layer | `FileStorage` + JSON | Same | Same | `DBStorage` + MySQL |
| User interface | Static HTML/CSS | Jinja2 templates | JSON responses | Dynamic JS + API calls |
| Transport | N/A | HTTP (HTML) | HTTP (JSON) | HTTP (JSON + CORS) |
| Documentation | README | README | README | Swagger/OpenAPI YAML |
| Security | N/A | N/A | N/A | Password hashing on `User` |
| DevOps | N/A | Fabric + Puppet | Fabric deploy | Dual-server setup (API + web) |

---

## Skills covered


- Switch between **file and database storage** using environment-driven dependency injection
- Model relational data with **SQLAlchemy** declarative base, columns, and `relationship()` mappings
- Run schema migrations with `Base.metadata.create_all()` and environment-specific teardown
- Annotate API routes with **Flasgger/Swagger** YAML for interactive documentation
- Build a **single-page-style listing** that fetches places, filters by amenities/states/cities, and loads reviews via AJAX
- Build **user registration** with required email/password fields and MD5 password hashing at the model layer
- Operate a **multi-process deployment**: API server on port 5000, dynamic web server on port 5001

---

## Project Structure

```
AirBnB_clone_v4/
├── models/
│   ├── base_model.py           # SQLAlchemy-aware BaseModel + to_dict()
│   ├── user.py                 # User with hashed password column
│   ├── state.py, city.py, place.py, amenity.py, review.py
│   ├── __init__.py             # Storage factory (file vs db)
│   └── engine/
│       ├── file_storage.py     # JSON fallback
│       └── db_storage.py       # SQLAlchemy session management
├── api/v1/
│   ├── app.py                  # Flask + CORS + Swagger
│   └── views/                  # CRUD + places_search + documentation/*.yml
├── web_flask/                  # Server-rendered pages backed by MySQL
├── web_dynamic/                # jQuery front end calling the API
│   ├── 0-hbnb.py … 101-hbnb.py
│   ├── templates/
│   └── static/scripts/         # Progressive JS milestones
├── web_static/                 # Static assets (0–103-index.html)
├── console.py                  # Works with either storage backend
├── setup_mysql_dev.sql
├── setup_mysql_test.sql
└── tests/                      # Includes DBStorage tests
```

---

## Storage Backends

Set `HBNB_TYPE_STORAGE` to choose the persistence engine:

| Value | Engine | Use Case |
|-------|--------|----------|
| *(unset)* or anything except `db` | `FileStorage` → `file.json` | Local development, tests |
| `db` | `DBStorage` → MySQL | Production-like deployment |

### MySQL Setup

```bash
cat setup_mysql_dev.sql | mysql -u root -p
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `HBNB_TYPE_STORAGE` | `db` to enable SQLAlchemy |
| `HBNB_MYSQL_USER` | Database user |
| `HBNB_MYSQL_PWD` | Database password |
| `HBNB_MYSQL_HOST` | Database host |
| `HBNB_MYSQL_DB` | Database name |
| `HBNB_ENV` | `test` drops tables on init |
| `HBNB_API_HOST` | API bind address |
| `HBNB_API_PORT` | API listen port (default 5000) |

`DBStorage` creates a SQLAlchemy engine, scoped session, and exposes the same interface as `FileStorage`: `all()`, `get()`, `new()`, `save()`, `delete()`, `reload()`, `close()`.

---

## REST API with Swagger

Start the API server:

```bash
export HBNB_TYPE_STORAGE=db
export HBNB_MYSQL_USER=hbnb_dev
export HBNB_MYSQL_PWD=hbnb_dev_pwd
export HBNB_MYSQL_HOST=localhost
export HBNB_MYSQL_DB=hbnb_dev_db
python3 -m api.v1.app
```

Interactive docs are served by **Flasgger** at `/apidocs/` (Swagger UI v3).

Each view function is decorated with `@swag_from('documentation/.../*.yml')`. YAML files under `api/v1/views/documentation/` describe request bodies, response schemas, and error codes for every endpoint.

### Notable Endpoints Beyond Phase 3

| Method | Path | Description |
|--------|------|-------------|
| POST | `/places_search/` | Filter places by states, cities, and amenities (JSON body) |
| GET | `/places/<id>/reviews` | Reviews for a place |
| POST | `/users` | Create user (`email` + `password` required) |

### Authentication (Model Layer)

The `User` model hashes passwords on assignment:

```python
def __setattr__(self, name, value):
    if name == "password":
        value = md5(value.encode()).hexdigest()
    super().__setattr__(name, value)
```

API user creation enforces `email` and `password` fields; stored credentials are never returned in GET responses.

---

## Dynamic Front End (`web_dynamic/`)

The dynamic web app runs on **port 5001** and consumes the API on **port 5000**.

```bash
python3 web_dynamic/101-hbnb.py
# Visit http://0.0.0.0:5001/101-hbnb/
```

### JavaScript Progression

| Script | Skill |
|--------|-------|
| `1-hbnb.js` | Checkbox amenity filter updates DOM text |
| `2-hbnb.js` | API status indicator (`/api/v1/status/`) |
| `3-hbnb.js` | Fetch and render places from API |
| `4-hbnb.js` | Client-side filtering |
| `100-hbnb.js` | Advanced filter UI |
| `101-hbnb.js` | Full search via `POST /places_search/`, lazy-loaded reviews |

Example: the status check turns the API health dot green when the backend responds OK:

```javascript
$.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === "OK") {
        $('#api_status').addClass('available');
    }
});
```

The final script posts filter selections as JSON and rebuilds the places grid without a page reload.

---

## Server-Rendered Pages (`web_flask/`)

Flask templates (`100-hbnb.html`, `101-hbnb.html`, `10-hbnb_filters.html`) query MySQL through `storage.all()` and pass sorted states, cities, amenities, and places to Jinja2—demonstrating both SSR and CSR approaches side by side.

---

## Console

The command interpreter works with either storage backend. Seed the database before starting the web tier:

```bash
export HBNB_TYPE_STORAGE=db
# ... MySQL env vars ...
./console.py
(hbnb) create User
(hbnb) update User <id> email "admin@hbnb.io" password "admin1234"
(hbnb) create State
(hbnb) update State <id> name "California"
(hbnb) quit
```

---

## Testing

```bash
export HBNB_TYPE_STORAGE=db
export HBNB_ENV=test
python3 -m unittest discover tests
```

Includes dedicated tests for `DBStorage` session lifecycle and model persistence.

---

## Deployment Architecture

```
┌─────────────────┐     AJAX/JSON      ┌─────────────────┐
│  web_dynamic    │ ─────────────────► │  api/v1 (5000)  │
│  Flask (5001)   │                    │  Flask + Swagger│
└─────────────────┘                    └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │  MySQL (hbnb)   │
                                     └─────────────────┘
```

Static assets deploy via the Fabric scripts inherited from Phases 2–3 (`0-setup_web_static.sh` through `3-deploy_web_static.py`).

---

## What Came Before

This project assumes completion of the full chain:

1. **[Phase 1](https://github.com/mgn-dev/AirBnB_clone)** — Models, console, JSON, static CSS
2. **[Phase 2](https://github.com/mgn-dev/AirBnB_clone_v2)** — Flask and Jinja2
3. **[Phase 3](https://github.com/mgn-dev/AirBnB_clone_v3)** — REST API and CRUD

Together, the four phases mirror how a real product evolves from a CLI prototype to a documented, database-backed web application.

---

## License

Public domain.
