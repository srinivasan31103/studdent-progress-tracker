// backend/middleware/securityLogger.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log security events to file
export const logSecurityEvent = (event, details) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    ...details
  };

  const logFile = path.join(logsDir, `security-${new Date().toISOString().split('T')[0]}.log`);
  fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 Security Event:', logEntry);
  }
};

// Middleware to log all requests
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response
  res.on('finish', () => {
    const duration = Date.now() - start;

    // Log suspicious requests
    if (res.statusCode >= 400) {
      logSecurityEvent('http_error', {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent'),
        duration,
        userId: req.user?.id || 'unauthenticated'
      });
    }

    // Log authentication attempts
    if (req.originalUrl?.includes('/api/auth/')) {
      logSecurityEvent('auth_attempt', {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        ip: req.ip || req.connection.remoteAddress,
        success: res.statusCode < 400
      });
    }
  });

  next();
};

// Middleware to detect and log suspicious activity
export const suspiciousActivityDetector = (req, res, next) => {
  const suspiciousPatterns = [
    /(\$where|\$ne|\$gt|\$lt)/i,  // NoSQL injection attempts
    /(<script|javascript:|onerror=)/i,  // XSS attempts
    /(union\s+select|drop\s+table)/i,  // SQL injection attempts
    /(\.\.\/|\.\.\\)/,  // Path traversal attempts
  ];

  const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + req.url;

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(checkString)) {
      logSecurityEvent('suspicious_activity', {
        pattern: pattern.toString(),
        method: req.method,
        url: req.originalUrl || req.url,
        ip: req.ip || req.connection.remoteAddress,
        body: req.body,
        query: req.query
      });
      break;
    }
  }

  next();
};
