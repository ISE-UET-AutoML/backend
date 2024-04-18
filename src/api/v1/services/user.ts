import { db } from "../db";
import { User } from "../models";

export type UserRequest = {
  username: string;
  email: string;
  password: string;
};

const createUser = async (req: UserRequest): Promise<Boolean> => {
  const { username, email, password } = req;
  try {
    const user = new User();
    user.name = username;
    user.email = email;
    user.password = password;
    await db.getRepository(User).save(user);
  } catch (error: any) {
    console.error(error);
    return false;
  }
  return true;
};

const findByEmail = async (email: string): Promise<User | null> => {
  try {
    return await db.getRepository(User).findOne({
      where: {
        email: email,
      },
    });
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

const findByUsername = async (username: string): Promise<User | null> => {
  try {
    return await db.getRepository(User).findOne({
      where: {
        name: username,
      },
    });
  } catch (error: any) {
    console.error(error);
    return null;
  }
};

export const UserServices = {
  createUser,
  findByEmail,
  findByUsername,
};
