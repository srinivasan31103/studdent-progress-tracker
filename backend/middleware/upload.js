// backend/middleware/upload.js
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Generate secure random filename to prevent path traversal
    const randomName = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomName}${ext}`);
  }
});

// Enhanced file filter with strict validation
const fileFilter = (req, file, cb) => {
  // Whitelist of allowed MIME types
  const allowedMimeTypes = {
    'text/csv': '.csv',
    'application/vnd.ms-excel': '.csv',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'application/pdf': '.pdf'
  };

  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  // Validate both extension and MIME type
  if (allowedMimeTypes[mimeType] && allowedMimeTypes[mimeType] === ext) {
    // Additional security: Check for null bytes in filename
    if (file.originalname.includes('\0')) {
      return cb(new Error('Invalid filename: null byte detected'));
    }

    // Check for path traversal attempts
    if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
      return cb(new Error('Invalid filename: path traversal detected'));
    }

    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV, JPEG, JPG, PNG and PDF files are allowed'));
  }
};

// Multer configuration with enhanced security
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1, // Only 1 file at a time
    fields: 10, // Limit number of fields
    parts: 20 // Limit total parts
  },
  fileFilter
});

export default upload;
