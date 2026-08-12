import { useState, useRef } from "react";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
const ALLOWED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function FileUploadBox({ file, onFileSelect, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState("");
  const inputRef = useRef(null);

  // File type aur size check karta hai, agar sahi hai to parent ko file bhejta hai
  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setLocalError("Only JPG, PNG, and PDF files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_SIZE_BYTES) {
      setLocalError(`File size must be less than ${MAX_SIZE_MB} MB.`);
      return;
    }

    setLocalError("");
    onFileSelect(selectedFile);
  };

  const handleInputChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onFileSelect(null);
    setLocalError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isImage = file && file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : null;
  const displayError = localError || error;

  return (
    <div>
      {!file ? (
        <div
          className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current.click()}
        >
          <div className="upload-icon">📁</div>
          <p className="upload-text">Drag & drop your file here</p>
          <p className="upload-or">OR</p>
          <button type="button" className="upload-choose-btn">
            Choose File
          </button>
          <p className="upload-hint">JPG, PNG, PDF — Max {MAX_SIZE_MB} MB</p>
          <input
            ref={inputRef}
            type="file"
            accept={ALLOWED_EXTENSIONS}
            onChange={handleInputChange}
            style={{ display: "none" }}
          />
        </div>
      ) : (
        <div className="upload-selected">
          {isImage ? (
            <img src={previewUrl} alt="Preview" className="upload-preview-img" />
          ) : (
            <div className="upload-file-icon">📄</div>
          )}
          <div className="upload-file-info">
            <p className="upload-file-name">{file.name}</p>
            <p className="upload-file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
          <button type="button" className="upload-remove-btn" onClick={handleRemove}>
            ✕
          </button>
        </div>
      )}
      {displayError && <span className="error-message">{displayError}</span>}
    </div>
  );
}

export default FileUploadBox;