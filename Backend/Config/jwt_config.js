"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordToken = exports.createRefreshToken = exports.createToken = exports.adminVerifyToken = exports.verifyToken = exports.verifyResetPasswordToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
dotenv_1.default.config();
const secret_key = process.env.JWT_SECRET;
const accessTokenTime = process.env.ACCESS_TOKEN_EXPIRY_TIME;
const refreshTokenTime = process.env.REFRESH_TOKEN_EXPIRY_TIME;
const userAccessTokenName = process.env.USER_ACCESS_TOKEN_NAME;
const userRefreshTokenName = process.env.USER_REFRESH_TOKEN_NAME;
const adminAccessTokenName = process.env.ADMIN_ACCESS_TOKEN_NAME;
const adminRefreshTokenName = process.env.ADMIN_REFRESH_TOKEN_NAME;
const userRole = process.env.USER_ROLE;
const adminRole = process.env.ADMIN_ROLE;
const createToken = (user_id, role) => {
    return jsonwebtoken_1.default.sign({ user_id, role }, secret_key, {
        expiresIn: accessTokenTime,
    });
};
exports.createToken = createToken;
const createRefreshToken = (user_id, role) => {
    return jsonwebtoken_1.default.sign({ user_id, role }, secret_key, {
        expiresIn: refreshTokenTime,
    });
};
exports.createRefreshToken = createRefreshToken;
const resetPasswordToken = (email, role) => {
    return jsonwebtoken_1.default.sign({ email, role }, secret_key, { expiresIn: "5m" });
};
exports.resetPasswordToken = resetPasswordToken;
const jwtverifyToken = (accessTokenName, refreshTokenName, expectedRole) => {
    return async (req, res, next) => {
        try {
            console.log(accessTokenName, refreshTokenName, expectedRole);
            const accessToken = req.cookies[accessTokenName];
            console.log(accessToken);
            if (accessToken) {
                jsonwebtoken_1.default.verify(accessToken, secret_key, async (err, decoded) => {
                    if (err) {
                        await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
                    }
                    else {
                        const { user_id, role } = decoded;
                        if (role !== expectedRole) {
                            return res
                                .status(httpStatusCode_1.default.Unauthorized)
                                .json({ message: "Access denied. Invalid role." });
                        }
                        // Set appropriate request field based on role
                        if (expectedRole === userRole) {
                            req.user_id = user_id;
                        }
                        else if (expectedRole === adminRole) {
                            console.log("Helloooo");
                            req.admin_id = user_id;
                        }
                        next();
                    }
                });
            }
            else {
                await handleRefreshToken(req, res, next, accessTokenName, refreshTokenName, expectedRole);
            }
        }
        catch (error) {
            res
                .status(httpStatusCode_1.default.Unauthorized)
                .json({ message: "Access denied. Access token not valid." });
        }
    };
};
const handleRefreshToken = async (req, res, next, accessTokenName, refreshTokenName, expectedRole) => {
    const refreshToken = req.cookies[refreshTokenName];
    console.log("refereseh", refreshToken);
    if (refreshToken) {
        jsonwebtoken_1.default.verify(refreshToken, secret_key, (err, decoded) => {
            if (err) {
                return res
                    .status(httpStatusCode_1.default.Unauthorized)
                    .json({ message: "Access denied. Refresh token not valid." });
            }
            else {
                const { user_id, role } = decoded;
                if (!user_id || role !== expectedRole) {
                    console.log(role);
                    console.log(expectedRole);
                    return res
                        .status(httpStatusCode_1.default.Unauthorized)
                        .json({ message: "Access denied. Token payload invalid." });
                }
                console.log(user_id, role);
                const newAccessToken = createToken(user_id, role);
                res.cookie(accessTokenName, newAccessToken, {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                    maxAge: 15 * 60 * 1000,
                });
                // Set appropriate request field based on role
                if (expectedRole === userRole) {
                    req.user_id = user_id;
                }
                else if (expectedRole === adminRole) {
                    req.admin_id = user_id;
                }
                next();
            }
        });
    }
    else {
        return res
            .status(httpStatusCode_1.default.Unauthorized)
            .json({ message: "Access denied. Refresh token not provided." });
    }
};
const verifyResetPasswordToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret_key);
        // Return email and role from the decoded token payload
        return {
            email: decoded.email || null,
            role: decoded.role || null, // Assuming `role` is part of the payload
        };
    }
    catch (err) {
        return { email: null, role: null }; // Return null values if the token is invalid
    }
};
exports.verifyResetPasswordToken = verifyResetPasswordToken;
exports.verifyToken = jwtverifyToken(userAccessTokenName, userRefreshTokenName, userRole);
exports.adminVerifyToken = jwtverifyToken(adminAccessTokenName, adminRefreshTokenName, adminRole);
