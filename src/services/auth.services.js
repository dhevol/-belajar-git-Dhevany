import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateTokens, verifyRefreshToken } from "../utils/token.js";

const prisma = new PrismaClient();

export const registerUser = async (userData) => {
  const {
    email,
    password,
    name,
    phoneNumber,
    birthDay,
    birthMonth,
    birthYear
  } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      phoneNumber,
      birthDay: Number.isInteger(+birthDay) ? parseInt(birthDay) : null,
      birthMonth: Number.isInteger(+birthMonth) ? parseInt(birthMonth) : null,
      birthYear: Number.isInteger(+birthYear) ? parseInt(birthYear) : null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phoneNumber: true,
      birthDay: true,
      birthMonth: true,
      birthYear: true
    }
  });

  const tokens = generateTokens(user.id);

  return { user, tokens };
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...safeUser } = user;

  const tokens = generateTokens(user.id);
  return { user: safeUser, tokens };
};

export const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyRefreshToken(refreshToken);
  const newTokens = generateTokens(decoded.userId);
  return newTokens;
};
