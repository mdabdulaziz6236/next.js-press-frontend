import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const verifyToken =async (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const jwtUtils = {
  verifyToken,
};
