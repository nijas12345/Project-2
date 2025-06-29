"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const email_config_1 = require("../Config/email_config");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class CompanyServices {
    constructor(companyRepository, adminRepository, userRepository, projectRepository, paymentRepository) {
        this.companyDetails = async (companyData, admin_id) => {
            const companyTwoAlphabets = companyData.companyName.slice(0, 2);
            const generatedOtp = Math
                .floor(1000 + Math.random() * 9000).toString();
            const refferalCode = companyTwoAlphabets + generatedOtp;
            companyData.refferalCode = refferalCode;
            const companyName = companyData.companyName;
            const existCompanyData = await this.companyRepository.existCompanyData(companyName);
            if (existCompanyData) {
                throw new HttpError_1.HttpError(httpStatusCode_1.default.Conflict, // 409 Conflict
                "Company data already exists");
            }
            const companyDetails = await this.companyRepository.companyDetails(companyData);
            if (!companyDetails)
                throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company Id Exist");
            const companyId = companyDetails._id;
            const adminData = await this.adminRepository.updateCompanyDetails(companyId, admin_id);
            if (!adminData) {
                throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, // 404
                "No admin data found");
            }
            if (!companyDetails) {
                throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, // 404
                "No company data found");
            }
            const members = companyDetails.members.map((member) => member.email);
            for (const member of members) {
                const isMailSended = await (0, email_config_1.sendInvitationLink)(member, refferalCode);
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, // 500
                    "Failed to send email");
                }
            }
            return adminData;
        };
        this.companyMembers = async (admin_id) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin data not found");
                }
                const companyId = adminData.companyId;
                if (!companyId)
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "company Id does not exist");
                const companyData = await this.companyRepository.companyFindById(companyId);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Company not found");
                }
                const members = companyData.members;
                if (!members.length) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No members found for this company");
                }
                const sortedMembers = members.sort((a, b) => {
                    return (new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime());
                });
                return sortedMembers;
            }
            catch (error) {
                throw error;
            }
        };
        this.searchMembers = async (admin_id, searchQuery, selectedProject) => {
            try {
                if (selectedProject?._id) {
                    const projectData = await this.projectRepository.findProjectById(selectedProject._id);
                    if (!projectData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No project data found");
                    }
                    const memberEmails = projectData.members.map((member) => member.email);
                    const users = await this.userRepository.searchProjectMembers(memberEmails, searchQuery);
                    return users;
                }
                else {
                    const adminData = await this.adminRepository.findByAdminId(admin_id);
                    if (!adminData || !adminData.companyId) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin data not found");
                    }
                    const companyData = await this.companyRepository.companyFindById(adminData.companyId);
                    if (!companyData) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Company not found");
                    }
                    const matchedMembers = companyData.members
                        .filter((member) => new RegExp(searchQuery, "i").test(member.email)) // Filter by email
                        .sort((a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime());
                    return matchedMembers;
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.companyData = async (admin_id) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData?.companyId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin data not found");
                }
                const companyId = adminData.companyId;
                const companyData = await this.companyRepository.companyFindById(companyId);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Company data not available");
                }
                return companyData.companyName;
            }
            catch (error) {
                throw error;
            }
        };
        this.inviationUsers = async (admin_id, members) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData?.companyId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Admin data not found");
                }
                const companyId = adminData.companyId;
                const companyData = await this.companyRepository.companyFindById(companyId);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "Company data not found");
                }
                const updatedCompany = await this.companyRepository.updateCompanyDetails(companyId, members);
                if (!updatedCompany) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Conflict, "No company members were modified");
                }
                const companyMembers = updatedCompany.members.sort((a, b) => new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime());
                const refferalCode = companyData.refferalCode;
                const newMembers = members.map((member) => member.email);
                for (const member of newMembers) {
                    const isMailSended = await (0, email_config_1.sendInvitationLink)(member, refferalCode);
                    if (!isMailSended) {
                        throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent");
                    }
                }
                return companyMembers;
            }
            catch (error) {
                throw error;
            }
        };
        this.inviteUser = async (admin_id, email) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData?.companyId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No Admin Data found");
                }
                const companyId = adminData.companyId;
                const companyData = await this.companyRepository.companyFindById(companyId);
                if (!companyData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No Company Data found");
                }
                const referralCode = companyData.refferalCode;
                const isMailSended = await (0, email_config_1.sendInvitationLink)(email, referralCode);
                if (!isMailSended) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Email not sent");
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.companyInfo = async (admin_id) => {
            try {
                const adminData = await this.adminRepository.findByAdminId(admin_id);
                if (!adminData?.companyId) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No Admin Data found");
                }
                const status = "active";
                const paymentData = await this.paymentRepository.paymentStatus(admin_id, status);
                let premium;
                if (paymentData) {
                    premium =
                        paymentData.subscription.charAt(0).toUpperCase() +
                            paymentData.subscription.slice(1) +
                            "Premium";
                }
                else {
                    premium = "Go Premium";
                }
                const companyId = adminData.companyId;
                const companyInfo = await this.companyRepository.companyFindById(companyId);
                if (!companyInfo) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company exists");
                }
                const companyName = companyInfo?.companyName;
                const userCount = await this.userRepository.countUserDocuments(companyId);
                const projectCount = await this.projectRepository.countProjectDocuments(admin_id);
                return { companyName, userCount, projectCount, premium };
            }
            catch (error) {
                throw error;
            }
        };
        this.companyName = async (user_id) => {
            try {
                const userData = await this.userRepository.findByUserId(user_id);
                if (!userData) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No user data exists");
                }
                if (!userData.refferalCode) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No referral code exists");
                }
                const refferalCode = userData.refferalCode;
                const companyDetails = await this.companyRepository.companyDetailsByRefferal(refferalCode);
                if (!companyDetails) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No company name exists");
                }
                return companyDetails?.companyName;
            }
            catch (error) {
                throw error;
            }
        };
        this.companyRepository = companyRepository;
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.paymentRepository = paymentRepository;
    }
}
exports.default = CompanyServices;
