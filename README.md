# Farm Field Tracking System

A cloud-synchronized system for tracking farming activities across fields, including spraying, tilling, planting, and harvesting operations.

## Project Structure

```
farm_tracker/
├── backend/           # Flask REST API
│   ├── app.py        # Main application file
│   ├── models.py     # Database models
│   └── requirements.txt
└── mobile/           # React Native mobile app (coming soon)
```

## Backend Setup

1. Create a Python virtual environment:
```bash
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run the server:
```bash
python app.py
```

The server will start at http://localhost:5000

## API Endpoints

### Fields
- GET /api/fields - List all fields
- GET /api/fields/<id> - Get specific field
- POST /api/fields - Create new field

### Activities
- GET /api/activities - List all activities
- GET /api/fields/<id>/activities - Get activities for specific field
- POST /api/activities - Record new activity

## Mobile App
The mobile app will be implemented using React Native to ensure iOS compatibility. Setup instructions will be provided soon.
