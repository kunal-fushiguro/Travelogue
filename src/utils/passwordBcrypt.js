import bcryptjs from "bcryptjs";

async function encryptPassword(password) {
  return await bcryptjs.hash(password, 12);
}

async function comparePassword(hashPassword, password) {
  return await bcryptjs.compare(password, hashPassword);
}

export { encryptPassword, comparePassword };
