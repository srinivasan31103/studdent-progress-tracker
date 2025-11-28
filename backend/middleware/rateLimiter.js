// backend/middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// Stricter rate limiting for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 login/register attempts per windowMs
  message: 'Too many authentication attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
