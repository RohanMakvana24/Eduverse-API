import jwt from "jsonwebtoken";

// ~ Generate Access Token
export const generateAccessToken = (userId) => {
    return jwt.sign({
        userId
    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"});
};

// ~ Generate Refresh Token
export const generateRefreshToken = (userId) => {
    return jwt.sign({
        userId
    }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
};
