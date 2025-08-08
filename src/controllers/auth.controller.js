// src/controllers/auth.controller.js

import {
  registerUser,
  loginUser,
  refreshAccessToken,
} from "../services/auth.services.js";
import { setRefreshTokenCookie } from "../utils/cookie.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { user, tokens } = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        birthDay: user.birthDay,
        birthMonth: user.birthMonth,
        birthYear: user.birthYear,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await loginUser(email, password);

    setRefreshTokenCookie(res, tokens.refreshToken);

    res.json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(401).json({
      success: false,
      message: error.message || "Invalid email or password",
    });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({
    success: true,
    message: "Logged out",
  });
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const newTokens = await refreshAccessToken(tokenFromCookie);
    setRefreshTokenCookie(res, newTokens.refreshToken);

    res.json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(403).json({
      success: false,
      message: error.message || "Invalid refresh token",
    });
  }
};
