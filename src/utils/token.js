import jwt from "jsonwebtoken";

export const generateTokens = (userId) => {
    
  const accessToken = jwt.sign(
    { userId }, process.env.ACCESS_TOKEN_SECRET,
     { expiresIn: "15m" }
    );

  const refreshToken = jwt.sign(
    { userId },
     process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" });

  return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: err };
  }
};