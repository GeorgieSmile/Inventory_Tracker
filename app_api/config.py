DATABASE_URL = "mysql+pymysql://root:password@localhost:3306/inventory_db"

DB_USER = "root"
DB_PASSWORD = "rootpass"  
DB_HOST = "localhost"
DB_NAME = "myapp"

# Build the URL
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"