import os
from flask import Flask, request, jsonify
import pyodbc
from werkzeug.utils import secure_filename
from dotenv import load_dotenv

# load environment variables
load_dotenv()

app = Flask(__name__)

# database connection string from environment variables
connect_string = os.getenv("DATABASE_URL")
connection = pyodbc.connect(connect_string)

# configure image upload
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')
app.config['IMAGE_UPLOADS'] = app.config['UPLOAD_FOLDER']
app.config['ALLOWED_IMAGE_EXTENSIONS'] = ["jpeg", "jpg", "png", "gif"]

# helper function for image validation
def allowed_image(filename):
    if "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in app.config['ALLOWED_IMAGE_EXTENSIONS']

class CarRepository:
    def __init__(self, cursor):
        self.cursor = cursor

    # add new or update the car if it already exists
    def add_or_update_car(self, product_name, product_image, product_quantity, product_price, category_id):
        # check for essential fields, allowing image to be optional for updates
        if not all([product_name, product_quantity, product_price, category_id]):
            return "Error: All fields must be provided and non-null, except image.", False

        image_url = None
        if product_image and allowed_image(product_image.filename):
            filename = secure_filename(product_image.filename)
            filepath = os.path.join(app.config['IMAGE_UPLOADS'], filename)
            try:
                product_image.save(filepath)
            except Exception as e:
                return jsonify({'error': 'Failed to save image', 'exception': str(e)}), 500
            image_url = filepath

        # check if the product exists
        self.cursor.execute("SELECT * FROM Basic_Product WHERE product_name=?", (product_name,))
        existing_product = self.cursor.fetchone()

        # if car already exists the value will be update are product_quantity and product_price
        # the product_image, product_name, category_id not changed
        # the condition to check is product_name
        if existing_product:
            # get current quantity of car
            self.cursor.execute("SELECT product_quantity FROM Basic_Product WHERE product_name=?", (product_name,))
            existing_product = self.cursor.fetchone()
            # set the quantity as total of current quantity and new quantity 
            new_quantity = existing_product[0] + int(product_quantity) 
            # update existing product with or without new image
            update_sql = "UPDATE Basic_Product SET product_quantity=?, product_price=?{} WHERE product_name=?".format(
                ", product_image=?" if image_url else "")
            update_values = [new_quantity, product_price] + ([image_url] if image_url else []) + [product_name]
            self.cursor.execute(update_sql, update_values)
            connection.commit()
            return "Car created", True
        else:
            # insert new product, requiring image
            if image_url is None:
                return "Error: Image file is required for new product.", False
            self.cursor.execute(
                "INSERT INTO Basic_Product (product_name, product_image, product_quantity, product_price, category_id) VALUES (?, ?, ?, ?, ?)",
                (product_name, image_url, product_quantity, product_price, category_id)
            )
            connection.commit()
            return "Car created", True

    # get all cars from the database
    # if the list is empty that return None
    def get_all_cars(self):
        self.cursor.execute("SELECT * FROM Basic_Product")
        products = self.cursor.fetchall()
        return products if products else None
    
    # edit a car with all attributes
    def update_car(self, product_id, product_name, product_image, product_quantity, product_price, category_id):
        image_url = None
        if product_image and allowed_image(product_image.filename):
            filename = secure_filename(product_image.filename)
            product_image.save(os.path.join(app.config['IMAGE_UPLOADS'], filename))
            image_url = os.path.join(app.config['IMAGE_UPLOADS'], filename)
        update_sql = "UPDATE Basic_Product SET product_name = ?, product_quantity = ?, product_price = ?, category_id = ?{} WHERE product_id = ?"
        update_values = [product_name, product_quantity, product_price, category_id, product_id]

        if image_url:
            update_sql = update_sql.format(", product_image = ?")
            # insert image_url before product_id
            update_values.insert(4, image_url)  
        else:
            update_sql = update_sql.format("")

        self.cursor.execute(update_sql, update_values)
        connection.commit()
        return "Car changed successfully"

    # remove the car by id
    def delete_car(self, product_id):
        self.cursor.execute("DELETE FROM Basic_Product WHERE product_id=?", (product_id,))
        connection.commit()
        # check if any rows were affected
        if self.cursor.rowcount > 0:
            return True
        else:
            return False

# api for add a new car
@app.route('/cars', methods=['POST', 'PUT'])
def add_and_update_car():
    if 'image' not in request.files:
        return jsonify({'error': 'No image part'}), 400
    image = request.files['image']
    product_name = request.form.get('product_name')
    product_quantity = request.form.get('product_quantity')
    product_price = request.form.get('product_price')
    category_id = request.form.get('category_id')

    cursor = connection.cursor()
    repo = CarRepository(cursor)
    message, success = repo.add_or_update_car(
        product_name, image, product_quantity, product_price, category_id
    )
    cursor.close()
    return jsonify({'message': message}), 201 if success and "created" in message else 200

# api for get all cars
@app.route('/all-cars', methods=['GET'])
def get_cars():
    cursor = connection.cursor()
    try:
        repo = CarRepository(cursor)
        products = repo.get_all_cars()
        if not products:
            return jsonify({'message': 'No cars found'}), 404
        # ensure cursor.description is accessed before cursor is closed
        # store column names
        columns = [column[0] for column in cursor.description]
        cars_data = [dict(zip(columns, product)) for product in products]
        return jsonify(cars_data), 200
    finally:
        cursor.close() 

# api for edit a car
@app.route('/edit-car/<int:product_id>', methods=['PUT'])
def update_car(product_id):
    if 'image' in request.files:
        image = request.files['image']
    else:
        image = None
    product_name = request.form.get('product_name')
    product_quantity = request.form.get('product_quantity')
    product_price = request.form.get('product_price')
    category_id = request.form.get('category_id')

    if not all([product_name, product_quantity, product_price, category_id]):
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        product_quantity = int(product_quantity)
        product_price = float(product_price)
        category_id = int(category_id)
    except ValueError:
        return jsonify({'error': 'Invalid input types'}), 400

    cursor = connection.cursor()
    repo = CarRepository(cursor)
    message = repo.update_car(product_id, product_name, image, product_quantity, product_price, category_id)
    cursor.close()
    return jsonify({'message': message}), 200


# api for delete a car
@app.route('/cars/<int:product_id>', methods=['DELETE'])
def delete_car(product_id):
    cursor = connection.cursor()
    repo = CarRepository(cursor)
    if repo.delete_car(product_id):
        cursor.close()
        return jsonify({'message': 'Car deleted'}), 200
    else:
        cursor.close()
        return jsonify({'error': 'Cannot remove, car could not be found'}), 404

if __name__ == '__main__':
    # get port from .env, default port is 5000
    port = int(os.getenv("PORT", "5000"))
    app.run(debug=False, port=port)
