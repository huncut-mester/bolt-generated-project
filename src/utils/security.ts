import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';
import DOMPurify from 'dompurify';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input);
}

export function generateMfaSecret(): string {
  return createHash('sha256')
    .update(Math.random().toString())
    .digest('hex')
    .substring(0, 20);
}

export function validateMfaToken(token: string, secret: string): boolean {
  // Implement MFA token validation logic
  return true; // Placeholder
}
