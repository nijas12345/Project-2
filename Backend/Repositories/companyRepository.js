"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class CompanyRepository extends baseRepository_1.default {
    constructor(companyModel) {
        super(companyModel);
        this.companyModel = (mongoose_1.Model);
        this.existCompanyData = async (companyName) => {
            try {
                return await this.findOne({ companyName });
            }
            catch (error) {
                throw error;
            }
        };
        this.companyDetails = async (companyData) => {
            try {
                return await this.createData(companyData);
            }
            catch (error) {
                throw error;
            }
        };
        this.companyFindById = async (companyId) => {
            try {
                return await this.findOne({
                    _id: companyId,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateCompanyDetails = async (companyId, members) => {
            try {
                const updatedCompany = await this.companyModel.findOneAndUpdate({ _id: companyId }, { $addToSet: { members: { $each: members } } }, { new: true });
                return updatedCompany;
            }
            catch (error) {
                throw error;
            }
        };
        this.companyDetailsByRefferal = async (refferalCode) => {
            try {
                return await this.findOne({
                    refferalCode
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateCompanyRefferal = async (refferalCode, email) => {
            try {
                return await this.findOneAndUpdate({
                    refferalCode: refferalCode, // Match the referral code
                    "members.email": email, // Match the email within the members array
                }, {
                    $set: { "members.$.status": "joined" }, // Update the status of the matching member
                }, { new: true } // Return the updated document
                );
            }
            catch (error) {
                throw error;
            }
        };
        this.updateJoinedStatus = async (email) => {
            try {
                return await this.findOneAndUpdate({
                    "members.email": email,
                }, {
                    $set: { "members.$.status": "joined" },
                }, { new: true });
            }
            catch (error) {
                throw error;
            }
        };
        this.companyModel = companyModel;
    }
}
exports.default = CompanyRepository;
