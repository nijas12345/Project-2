"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const axios_1 = require("axios");
const handleError_1 = require("../Utils/handleError");
class CompanyController {
    constructor(companyService) {
        this.companyDetails = async (req, res) => {
            try {
                const companyData = req.body;
                const admin_id = req.admin_id;
                const serviceResponse = await this.companyService.companyDetails(companyData, admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.companyMembers = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.companyService.companyMembers(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.searchMembers = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const searchQuery = req.body.searchQuery;
                const selectedProject = req.body.selectedProject;
                const serviceResponse = await this.companyService.searchMembers(admin_id, searchQuery, selectedProject);
                console.log("service", serviceResponse);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.companyData = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.companyService.companyData(admin_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.invitationUsers = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const members = req.body.members;
                const serviceResponse = await this.companyService.inviationUsers(admin_id, members);
                console.log("service");
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.inviteUser = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const email = req.body.email;
                await this.companyService.inviteUser(admin_id, email);
                res.status(axios_1.HttpStatusCode.Ok).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.companyInfo = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const serviceResponse = await this.companyService.companyInfo(admin_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.companyName = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.companyService.companyName(user_id);
                res.status(axios_1.HttpStatusCode.Ok).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.companyService = companyService;
    }
}
exports.default = CompanyController;
