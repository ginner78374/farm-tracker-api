import os

# Bind to the port specified by Render
bind = f"0.0.0.0:{os.getenv('PORT', '10000')}"

# Worker configuration
workers = 4
worker_class = 'sync'

# Set the Python path to include our application directory
pythonpath = '.'

# Access logging
accesslog = '-'
errorlog = '-'

# Timeout configuration
timeout = 120
