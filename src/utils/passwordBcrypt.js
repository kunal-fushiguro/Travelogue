import bcryptjs from "bcryptjs";

const encryptPassword = async (password) => {
  return await bcryptjs.hash(password, 12);
};

const comparePassword = async (hashPassword, password) => {
  return await bcryptjs.compare(password, hashPassword);
};

export { encryptPassword, comparePassword };
