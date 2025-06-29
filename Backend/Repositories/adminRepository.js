"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class AdminRepository extends baseRepository_1.default {
    constructor(adminModel) {
        super(adminModel);
        this.adminModel = (mongoose_1.Model);
        this.findByEmail = async (email) => {
            try {
                return await this.findOne({ email });
            }
            catch (error) {
                throw error;
            }
        };
        this.register = async (adminData) => {
            try {
                return await this.createData(adminData);
            }
            catch (error) {
                throw error;
            }
        };
        this.login = async (email) => {
            try {
                return await this.findOne({ email }, { _id: 0 });
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
                throw error;
            }
        };
        this.createAdmin = async (email, admin_id) => {
            try {
                const adminData = {
                    firstName: email.split("@")[0],
                    email,
                    admin_id,
                };
                const createdAdmin = await this.adminModel.create(adminData);
                const { _id, ...adminWithoutId } = createdAdmin.toObject();
                return adminWithoutId;
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
                await this.findOneAndUpdate({ email }, { $set: { password: password } });
            }
            catch (error) {
                throw error;
            }
        };
        this.findByAdminId = async (admin_id) => {
            try {
                return await this.findOne({ admin_id });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateProfileImage = async (admin_id, profileURL) => {
            try {
                return await this.findOneAndUpdate({ admin_id }, { $set: { profileImage: profileURL } });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateAdmin = async (admin_id, admin) => {
            try {
                return await this.findOneAndUpdate({ admin_id }, {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    phone: admin.phone,
                    address: admin.address,
                    position: admin.position,
                    city: admin.city,
                    state: admin.state,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateCompanyDetails = async (companyId, admin_id) => {
            try {
                return await this.findOneAndUpdate({ admin_id }, {
                    companyId
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.adminModel = adminModel;
    }
}
exports.default = AdminRepository;
