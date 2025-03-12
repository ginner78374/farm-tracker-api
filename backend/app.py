import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_restful import Api, Resource
from models import db, Field, FieldActivity
from datetime import datetime

app = Flask(__name__, static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})  # Enable CORS for all API routes
api = Api(app)

# Configure SQLAlchemy for both local and production
database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/farm_tracker')
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['DEBUG'] = False

# Initialize the database
db.init_app(app)

# Drop and recreate tables to handle schema changes
with app.app_context():
    db.drop_all()
    db.create_all()

class FieldResource(Resource):
    def get(self, field_id=None):
        if field_id:
            field = Field.query.get_or_404(field_id)
            return field.to_dict()
        fields = Field.query.all()
        return [f.to_dict() for f in fields]

    def post(self):
        data = request.get_json()
        size = data.get('size') or data.get('size_acres')  # Try both field names
        field = Field(
            name=data['name'],
            size_acres=float(size) if size is not None else None,  # Convert to float
            location=data.get('location')
        )
        db.session.add(field)
        db.session.commit()
        return field.to_dict(), 201  # Return the full field object

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
