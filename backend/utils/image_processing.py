import cv2
import pytesseract
from PIL import Image
import numpy as np
import os
import logging
from PIL.ExifTags import TAGS

logging.basicConfig(level=logging.DEBUG)

# Tesseract path is handled by server installation (no need for explicit path on Linux-based servers)
# For local Windows testing, uncomment:
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def get_image_metadata(filepath):
    try:
        image = Image.open(filepath)
        exif_data = image.getexif()
        metadata = {}
        if exif_data:
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                metadata[tag] = str(value)
        else:
            metadata['info'] = 'No EXIF metadata found'
        image.close()
        return metadata
    except Exception as e:
        logging.error(f"Error extracting metadata: {str(e)}")
        return {'error': f'Failed to extract metadata: {str(e)}'}

def process_image(filepath, operation, params=None):
    try:
        if params is None:
            params = {}
        img = cv2.imread(filepath)
        if img is None:
            raise ValueError(f"Failed to load image: {filepath}")
        processed_path = os.path.join('static/processed', os.path.basename(filepath))
        result = None
        
        metadata = get_image_metadata(filepath)
        logging.debug(f"Metadata: {metadata}")
        
        if operation == 'gaussian_blur':
            kernel_size = params.get('kernel_size', 3)
            if kernel_size % 2 == 0:
                kernel_size += 1
            processed_img = cv2.GaussianBlur(img, (kernel_size, kernel_size), 0)
            cv2.imwrite(processed_path, processed_img)
        
        elif operation == 'sobel_edge':
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            sobel_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            sobel = cv2.magnitude(sobel_x, sobel_y)
            processed_img = cv2.convertScaleAbs(sobel)
            cv2.imwrite(processed_path, processed_img)
        
        elif operation == 'canny_edge':
            threshold1 = params.get('threshold1', 100)
            threshold2 = params.get('threshold2', 200)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            processed_img = cv2.Canny(gray, threshold1, threshold2)
            cv2.imwrite(processed_path, processed_img)
        
        elif operation == 'histogram_equalization':
            img_yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
            img_yuv[:,:,0] = cv2.equalizeHist(img_yuv[:,:,0])
            processed_img = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
            cv2.imwrite(processed_path, processed_img)
        
        elif operation == 'adaptive_threshold':
            block_size = params.get('block_size', 11)
            c = params.get('c', 2)
            if block_size % 2 == 0:
                block_size += 1
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            processed_img = cv2.adaptiveThreshold(
                gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, block_size, c
            )
            cv2.imwrite(processed_path, processed_img)
        
        elif operation == 'ocr':
            logging.debug(f"Performing OCR on {filepath}")
            try:
                gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                processed_img = cv2.adaptiveThreshold(
                    gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
                )
                temp_path = os.path.join('static/processed', f"temp_{os.path.basename(filepath)}")
                cv2.imwrite(temp_path, processed_img)
                result = pytesseract.image_to_string(Image.open(temp_path), lang='eng')
                logging.debug(f"OCR result: {result}")
                cv2.imwrite(processed_path, img)
                os.remove(temp_path)
            except pytesseract.TesseractError as e:
                logging.error(f"Tesseract OCR error: {str(e)}")
                raise
            except Exception as e:
                logging.error(f"General OCR error: {str(e)}")
                raise
        
        else:
            raise ValueError(f"Unsupported operation: {operation}")
        
        return processed_path, result, metadata
    except Exception as e:
        logging.error(f"Error in process_image: {str(e)}")
        raise