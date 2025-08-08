export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
    secure: process.env.NODE_ENV === "production", // hanya https kalau production
    sameSite: "strict",
  });
};
