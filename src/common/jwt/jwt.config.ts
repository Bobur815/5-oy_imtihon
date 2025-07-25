
export const JwtAccessOptions = {
  secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h' },
};

export const JwtRefreshOptions = {
  secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
};
