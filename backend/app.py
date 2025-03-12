import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_restful import Api, Resource
from models import db, Field, FieldActivity
from datetime import datetime
import logging

# Set up logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

app = Flask(__name__, static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all API routes
api = Api(app)

# Configure SQLAlchemy for both local and production
database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/farm_tracker')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

# Add query logging to database URL
if '?' in database_url:
    database_url += '&echo=true'
else:
    database_url += '?echo=true'

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = True  # Enable debug mode to see more info

# Initialize the database
db.init_app(app)

# Create tables within app context
with app.app_context():
    db.create_all()

class FieldResource(Resource):
    def get(self, field_id=None):
        if field_id:
            field = Field.query.get_or_404(field_id)
            return field.to_dict()
        fields = Field.query.all()
        return [f.to_dict() for f in fields]

    def post(self):
        try:
            data = request.get_json()
            app.logger.info(f"Received field data: {data}")
            
            # Get size from either 'size' or 'size_acres' field
            size = data.get('size')
            if size is None:
                size = data.get('size_acres')
            
            app.logger.info(f"Size value before conversion: {size}")
            
            # Create field with explicit size_acres value
            field = Field(
                name=data['name'],
                size_acres=float(size) if size is not None else None,
                location=data.get('location')
            )
            
            # Log field before saving
            app.logger.info(f"Field before save: name={field.name}, size_acres={field.size_acres}")
            
            # Save to database
            db.session.add(field)
            db.session.commit()
            
            # Refresh the field object
            db.session.refresh(field)
            
            # Log field after saving
            app.logger.info(f"Field after save: name={field.name}, size_acres={field.size_acres}")
            
            return field.to_dict(), 201
            
        except Exception as e:
            app.logger.error(f"Error creating field: {str(e)}")
            db.session.rollback()
            return {'message': f'Error creating field: {str(e)}'}, 500

class FieldActivityResource(Resource):
    def get(self, field_id=None):
        if field_id:
            activities = FieldActivity.query.filter_by(field_id=field_id).all()
        else:
            activities = FieldActivity.query.all()
        return [activity.to_dict() for activity in activities]

    def post(self):
        data = request.get_json()
        activity = FieldActivity(
            field_id=data['field_id'],
            activity_type=data['activity_type'],
            date=datetime.fromisoformat(data['date']) if 'date' in data else datetime.utcnow(),
            details=data.get('details'),
            created_by=data['created_by']
        )
        db.session.add(activity)
        db.session.commit()
        return {'id': activity.id, 'message': 'Activity recorded successfully'}, 201

# Register API resources
api.add_resource(FieldResource, '/api/fields', '/api/fields/<int:field_id>')
api.add_resource(FieldActivityResource, '/api/activities', '/api/fields/<int:field_id>/activities')

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
