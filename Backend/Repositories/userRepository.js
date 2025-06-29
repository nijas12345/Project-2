"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class UserRepository extends baseRepository_1.default {
    constructor(userModel) {
        super(userModel);
        this.userModel = (mongoose_1.Model);
        this.findByEmail = async (email) => {
            try {
                return await this.findOne({ email });
            }
            catch (error) {
                throw error;
            }
        };
        this.findByUserId = async (user_id) => {
            try {
                return await this.findOne({
                    user_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.register = async (userData) => {
            try {
                return await this.createData(userData);
            }
            catch (error) {
                throw error;
            }
        };
        this.login = async (email) => {
            try {
                return await this.userModel.findOne({ email: email }, { _id: 0 });
            }
            catch (error) {
                throw error;
            }
        };
        this.verifyGoogleAuth = async (email) => {
            try {
                return await this.findOne({ email }, { _id: 0 });
            }
            catch (error) {
                console.log(error);
                return null;
            }
        };
        this.createUser = async (email, user_id) => {
            try {
                const userData = {
                    firstName: email.split("@")[0],
                    email,
                    user_id,
                };
                const createdUser = await this.userModel.create(userData);
                const { _id, ...userWithoutId } = createdUser.toObject();
                return userWithoutId;
            }
            catch (error) {
                throw error;
            }
        };
        this.resetPassword = async (email) => {
            try {
                return await this.findOne({ email });
            }
            catch (error) {
                throw error;
            }
        };
        this.confirmResetPassword = async (email, password) => {
            try {
                await this.findOneAndUpdate({ email: email }, {
                    password: password,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateUser = async (user_id, user) => {
            try {
                return await this.findOneAndUpdate({ user_id: user_id }, {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    position: user.position,
                    city: user.city,
                    state: user.state,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.userBlock = async (user_id) => {
            try {
                return await this.findOneAndUpdate({ user_id: user_id }, {
                    isBlocked: true,
                }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.userUnBlock = async (user_id) => {
            try {
                return await this.userModel.findOneAndUpdate({ user_id: user_id }, {
                    isBlocked: false,
                }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.profilePicture = async (user_id, profileURL) => {
            try {
                return await this.findOneAndUpdate({ user_id }, { profileImage: profileURL }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.addRefferalCodeToUser = async (user_id, refferalCode, companyId) => {
            try {
                const userData = await this.findOneAndUpdate({ user_id }, {
                    refferalCode,
                    companyId
                });
                return userData;
            }
            catch (error) {
                throw error;
            }
        };
        this.userWithoutId = async (user_id) => {
            try {
                return await this.findOne({ user_id: user_id }, { _id: 0, companyId: 0 } // Exclude _id and companyId
                );
            }
            catch (error) {
                throw error;
            }
        };
        this.searchProjectMembers = async (memberEmails, searchQuery) => {
            try {
                const searchRegex = new RegExp(searchQuery, "i");
                return await this.findAll({
                    email: { $in: memberEmails, $regex: searchRegex },
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.countUserDocuments = async (companyId) => {
            try {
                const userCount = await this.userModel.countDocuments({
                    companyId: companyId,
                });
                return userCount;
            }
            catch (error) {
                throw error;
            }
        };
        this.existingUsers = async (refferalCode, memberEmails) => {
            try {
                return await this.findAll({
                    email: { $in: memberEmails },
                    refferalCode
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.findUsers = async (memberEmails) => {
            try {
                return await this.findAll({ email: { $in: memberEmails } });
            }
            catch (error) {
                throw error;
            }
        };
        this.userIsBlocked = async (user_id) => {
            try {
                return await this.findOne({
                    user_id
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.userModel = userModel;
    }
}
exports.default = UserRepository;
