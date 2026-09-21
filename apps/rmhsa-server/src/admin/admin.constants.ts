// Ported from constants/adminCredentials.js.
import * as bcrypt from 'bcryptjs';

export const adminEmail = 'demo@gmail.com';
export const adminPasswords = [
  '$2a$10$OoPVVTBl6z0lHMIJTsT9fOBIA1YCTQPdlAvyednULmU7Ein2ChGRu',
  '$2a$10$wYOD94Pntwx939IUfosPD.kCi60K.uBaZ3MktaQjWbaF6ZQPeL66O',
];

export const checkPassword = async (password: string): Promise<boolean> => {
  for (const adminPassword of adminPasswords) {
    const isMatch = await bcrypt.compare(password, adminPassword);
    if (isMatch) {
      return true;
    }
  }
  return false;
};
