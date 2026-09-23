// Ported from constants/adminCredentials.js.
import * as bcrypt from 'bcryptjs';

export const adminEmail = 'demo@gmail.com';

// Supported admin passwords (both plain text and hashed)
export const adminPasswords = [
  '#demo1234',
  '#admin1234',
  '$2b$10$rOsqDgImgLs/LuPP3QfM0OtSxnJQNeiWEphHr0nRayvxVyz8Q4W1G', // bcrypt hash for '#demo1234'
  '$2b$10$/iPlDu44kAdeLj0ReYycUeNn8thrKxT/jkDrFjuumBP/l7OlHBGUy', // bcrypt hash for '#admin1234'
];

export const checkPassword = async (password: string): Promise<boolean> => {
  for (const adminPassword of adminPasswords) {
    if (password === adminPassword) {
      return true;
    }
    try {
      const isMatch = await bcrypt.compare(password, adminPassword);
      if (isMatch) {
        return true;
      }
    } catch {
      // Skip if adminPassword is not a valid bcrypt hash format
    }
  }
  return false;
};
