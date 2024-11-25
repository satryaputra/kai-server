import bcrypt from "bcrypt";

const saltRounds = 10;

const hasher = {
  hash: async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  },
  verify: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
  },
};

export default hasher;
