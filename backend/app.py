from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from utils.image_processing import process_image

app = Flask(__name__)
# Allow CORS for your frontend's deployed URL (update after deploying frontend)
CORS(app, resources={r"/upload": {"origins": ["http://localhost:3000", "https://your-frontend-domain.vercel.app"]}})

UPLOAD_FOLDER = 'static/uploads'
PROCESSED_FOLDER = 'static/processed'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Get operation and parameters
        operation = request.form.get('operation', 'grayscale')
        params = {
            'kernel_size': int(request.form.get('kernel_size', 3)),
            'threshold1': int(request.form.get('threshold1', 100)),
            'threshold2': int(request.form.get('threshold2', 200)),
            'block_size': int(request.form.get('block_size', 11)),
            'c': int(request.form.get('c', 2))
        }
        
        try:
            processed_path, result, metadata = process_image(filepath, operation, params)
            return jsonify({
                'processed_image': f'/processed/{os.path.basename(processed_path)}',
                'result': result,
                'metadata': metadata
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/processed/<filename>')
def serve_processed_image(filename):
    return send_file(os.path.join(app.config['PROCESSED_FOLDER'], filename))

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000)) 
    app.run(host='0.0.0.0', port=port, debug=False)