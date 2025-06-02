import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Download, ChevronDown, Loader, X, Check, Sliders, FileText } from 'lucide-react';

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [operation, setOperation] = useState('gaussian_blur');
  const [kernelSize, setKernelSize] = useState(3);
  const [threshold1, setThreshold1] = useState(100);
  const [threshold2, setThreshold2] = useState(200);
  const [blockSize, setBlockSize] = useState(11);
  const [cValue, setCValue] = useState(2);
  const [processedImage, setProcessedImage] = useState(null);
  const [result, setResult] = useState(null);
  const [metadata, setMetadata] = useState(null); // New state for metadata
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(true);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessedImage(null);
      setResult(null);
      setMetadata(null); // Reset metadata
      setError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg']
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('operation', operation);
    formData.append('kernel_size', kernelSize.toString());
    formData.append('threshold1', threshold1.toString());
    formData.append('threshold2', threshold2.toString());
    formData.append('block_size', blockSize.toString());
    formData.append('c', cValue.toString());

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Response:', response.data); // Debug log
      setProcessedImage(`http://localhost:5000${response.data.processed_image}`);
      setResult(response.data.result);
      setMetadata(response.data.metadata); // Store metadata
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error processing image. Please try again.';
      setError(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.href = processedImage;
      link.download = `processed-${file?.name || 'image.png'}`;
      link.click();
    }
  };

  const resetImage = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedImage(null);
    setResult(null);
    setMetadata(null); // Reset metadata
    setError(null);
  };

  const getOperationName = (key) => {
    const names = {
      'gaussian_blur': 'Gaussian Blur',
      'sobel_edge': 'Sobel Edge Detection',
      'canny_edge': 'Canny Edge Detection',
      'histogram_equalization': 'Histogram Equalization',
      'adaptive_threshold': 'Adaptive Thresholding',
      'ocr': 'OCR (Text Extraction)'
    };
    return names[key] || key;
  };

  // Format metadata for display
  const formatMetadata = (metadata) => {
    if (!metadata || metadata.error) {
      return 'No metadata available';
    }
    const formatted = [];
    for (const [key, value] of Object.entries(metadata)) {
      formatted.push(`${key}: ${value}`);
    }
    return formatted.join('\n');
  };

  return (
    <section id="upload" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column - Upload Area & Controls */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-card">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <Upload className="mr-2 text-primary" size={20} />
                    Image Upload
                  </h2>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 text-center cursor-pointer ${
                      isDragActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-dark-600 hover:border-primary/50 hover:bg-dark-700/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    
                    {!previewUrl ? (
                      <div className="space-y-4">
                        <div className="w-20 h-20 bg-dark-700 rounded-full flex items-center justify-center mx-auto">
                          <ImageIcon size={36} className="text-light-400" />
                        </div>
                        
                        <div>
                          <p className="text-light-300 mb-2">
                            {isDragActive 
                              ? 'Drop the image here...' 
                              : 'Drag & drop an image here, or click to select'}
                          </p>
                          <p className="text-light-500 text-sm">
                            Supports JPG, JPEG, PNG
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <img 
                          src={previewUrl}
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded"
                        />
                        <p className="mt-3 text-light-300">{file?.name}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetImage(); }}
                          className="absolute top-0 right-0 bg-dark-900/80 rounded-full p-1 hover:bg-dark-800"
                        >
                          <X size={16} className="text-light-300" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Controls Panel */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-card">
                <div 
                  className="p-4 border-b border-dark-700 flex justify-between items-center cursor-pointer"
                  onClick={() => setIsControlsOpen(!isControlsOpen)}
                >
                  <h3 className="text-xl font-medium flex items-center">
                    <Sliders className="mr-2 text-primary" size={18} />
                    Processing Controls
                  </h3>
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-300 ${isControlsOpen ? 'rotate-180' : ''}`} 
                  />
                </div>
                
                {isControlsOpen && (
                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-light-300 mb-2 font-medium">Operation</label>
                      <select
                        value={operation}
                        onChange={(e) => setOperation(e.target.value)}
                        className="w-full p-3 bg-dark-700 border border-dark-600 rounded-lg text-light-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {['gaussian_blur', 'sobel_edge', 'canny_edge', 'histogram_equalization', 'adaptive_threshold', 'ocr'].map(op => (
                          <option key={op} value={op}>{getOperationName(op)}</option>
                        ))}
                      </select>
                    </div>
                    
                    {operation === 'gaussian_blur' && (
                      <ParameterSlider
                        label="Kernel Size"
                        value={kernelSize}
                        min={3}
                        max={15}
                        step={2}
                        onChange={setKernelSize}
                        showValue={true}
                      />
                    )}
                    
                    {operation === 'canny_edge' && (
                      <>
                        <ParameterSlider
                          label="Threshold 1"
                          value={threshold1}
                          min={50}
                          max={300}
                          step={10}
                          onChange={setThreshold1}
                          showValue={true}
                        />
                        <ParameterSlider
                          label="Threshold 2"
                          value={threshold2}
                          min={50}
                          max={300}
                          step={10}
                          onChange={setThreshold2}
                          showValue={true}
                        />
                      </>
                    )}
                    
                    {operation === 'adaptive_threshold' && (
                      <>
                        <ParameterSlider
                          label="Block Size"
                          value={blockSize}
                          min={3}
                          max={25}
                          step={2}
                          onChange={setBlockSize}
                          showValue={true}
                        />
                        <ParameterSlider
                          label="C Value"
                          value={cValue}
                          min={0}
                          max={10}
                          step={1}
                          onChange={setCValue}
                          showValue={true}
                        />
                      </>
                    )}
                    
                    <button
                      onClick={handleUpload}
                      disabled={!file || loading}
                      className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all duration-300 ${
                        !file 
                          ? 'bg-dark-600 text-light-400 cursor-not-allowed' 
                          : 'bg-primary hover:bg-primary-dark text-white'
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader size={20} className="animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={20} className="mr-2" />
                          Process Image
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Results Area */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-card h-full">
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 flex items-center">
                    <ImageIcon className="mr-2 text-primary" size={20} />
                    Results
                  </h2>
                  
                  {error && (
                    <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-lg mb-4 animate-fadeIn">
                      <p className="flex items-center">
                        <X size={18} className="mr-2" />
                        {error}
                      </p>
                    </div>
                  )}
                  
                  {!processedImage && !result && !metadata && !error ? (
                    <div className="flex items-center justify-center h-80 border border-dark-600 rounded-xl bg-dark-700/50">
                      <p className="text-light-400">Processed image will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-fadeIn">
                      {processedImage && (
                        <div className="relative border border-dark-600 rounded-xl overflow-hidden bg-dark-700/50">
                          <img
                            src={processedImage}
                            alt="Processed"
                            className="max-w-full max-h-96 mx-auto"
                          />
                          <button
                            onClick={handleDownload}
                            className="absolute top-3 right-3 bg-dark-900/80 p-2 rounded-full hover:bg-dark-800 transition-colors duration-300"
                            title="Download processed image"
                          >
                            <Download size={20} className="text-light-300" />
                          </button>
                        </div>
                      )}
                      
                      {metadata && (
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium flex items-center">
                            <FileText className="mr-2 text-primary" size={18} />
                            Image Metadata
                          </h3>
                          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600 max-h-60 overflow-auto">
                            <pre className="text-light-300 whitespace-pre-wrap">{formatMetadata(metadata)}</pre>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(formatMetadata(metadata));
                              }}
                              className="text-primary text-sm flex items-center hover:text-primary-dark transition-colors duration-300"
                            >
                              <Check size={14} className="mr-1" />
                              Copy to clipboard
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {result && (
                        <div className="space-y-2">
                          <h3 className="text-xl font-medium flex items-center">
                            <FileText className="mr-2 text-primary" size={18} />
                            OCR Result
                          </h3>
                          <div className="bg-dark-700 p-4 rounded-lg border border-dark-600 max-h-60 overflow-auto">
                            <pre className="text-light-300 whitespace-pre-wrap">{result}</pre>
                          </div>
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(result);
                              }}
                              className="text-primary text-sm flex items-center hover:text-primary-dark transition-colors duration-300"
                            >
                              <Check size={14} className="mr-1" />
                              Copy to clipboard
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ParameterSlider = ({ 
  label, value, min, max, step, onChange, showValue = false 
}) => (
  <div>
    <div className="flex justify-between mb-2">
      <label className="text-light-300 font-medium">{label}</label>
      {showValue && <span className="text-light-400">{value}</span>}
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between text-xs text-light-500 mt-1">
      <span>{min}</span>
      <span>{max}</span>
    </div>
  </div>
);

export default ImageUpload;