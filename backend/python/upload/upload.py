from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import os
import pyodbc

app = Flask(__name__)
load_dotenv()

# Load cấu hình từ biến môi trường
app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER')
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}


class UploadRepository:
    def __init__(self):
        self.conn_str = os.getenv('DATABASE_URL')
        self.conn = pyodbc.connect(self.conn_str)
        self.cursor = self.conn.cursor()

    def insert_image(self, image_name, image_url):
        self.cursor.execute("INSERT INTO Basic_Upload_IMAGE (image_name, image_url) VALUES (?, ?)", (image_name, image_url))
        self.conn.commit()

    def get_all_images(self):
        self.cursor.execute("SELECT image_id, image_name, image_url FROM Basic_Upload_IMAGE")
        rows = self.cursor.fetchall()
        return [{'image_id': row[0], 'image_name': row[1], 'image_url': row[2]} for row in rows]
    
    def delete_image(self, image_id):
        self.cursor.execute("DELETE FROM Basic_Upload_IMAGE WHERE image_id = ?", (image_id,))
        self.conn.commit()
        # Returns the number of rows affected by the last executed statement
        return self.cursor.rowcount  

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

#api get all images
@app.route('/images', methods=['GET'])
def get_images():
    repo = UploadRepository()
    images = repo.get_all_images()
    return jsonify(images)

# api upload image file
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Lưu thông tin hình ảnh vào cơ sở dữ liệu
        repo = UploadRepository()
        repo.insert_image(filename, file_path)
        
        return jsonify({'message': 'File uploaded successfully', 'filename': filename}), 200
    return jsonify({'error': 'Invalid file format'}), 400

@app.route('/upload/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    repo = UploadRepository()
    try:
        rows_deleted = repo.delete_image(image_id)
        if rows_deleted == 0:
            return jsonify({'error': 'Cannot remove, image could not be found'}), 404
        return jsonify({'message': 'Image deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(debug=False, port=port)
