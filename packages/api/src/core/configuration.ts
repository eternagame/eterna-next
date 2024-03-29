import crypto from 'crypto';

export interface ConfigSchema {
  jwtSecret: string | Buffer;
}

export default (): ConfigSchema => ({
  jwtSecret: process.env['JWT_SECRET'] ?? crypto.randomBytes(16),
});
