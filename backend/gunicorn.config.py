bind = "0.0.0.0:8080"
workers = 4
# Using Uvicorn's Gunicorn worker class
worker_class = "uvicorn.workers.UvicornWorker"