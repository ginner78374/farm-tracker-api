# Farm Tracker API

A Flask-based REST API for tracking farm field activities.

## Deployment Instructions

### Environment Variables Required:
- `DATABASE_URL`: PostgreSQL database URL (provided by Render)
- `PYTHON_VERSION`: 3.12.2

### Build Commands
```bash
pip install -r requirements.txt
```

### Start Command
```bash
gunicorn app:app
```
