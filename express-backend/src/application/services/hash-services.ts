import bcrypt from 'bcrypt';

export async function hashPassword(password:string, saltRounds:number){
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

export async function comparePassword(password:string, hashedPassword:string, saltRounds:number){
  try {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    throw error;
  }
}

