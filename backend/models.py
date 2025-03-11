from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Field(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    size_acres = db.Column(db.Float)
    location = db.Column(db.String(200))
    activities = db.relationship('FieldActivity', backref='field', lazy=True)

class FieldActivity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    field_id = db.Column(db.Integer, db.ForeignKey('field.id'), nullable=False)
    activity_type = db.Column(db.String(50), nullable=False)  # 'sprayed', 'tilled', 'planted', 'harvested'
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    details = db.Column(db.Text)
    created_by = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'field_id': self.field_id,
            'activity_type': self.activity_type,
            'date': self.date.isoformat(),
            'details': self.details,
            'created_by': self.created_by
        }
