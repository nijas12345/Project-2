"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const handleError_1 = require("../Utils/handleError");
class WorkLogController {
    constructor(workLogService) {
        this.clockIn = async (req, res) => {
            try {
                const user_id = req.user_id;
                const date = req.body.clockInTime;
                const serviceResponse = await this.workLogService.clockIn(user_id, date);
                res.status(httpStatusCode_1.default.OK).json({ serviceResponse });
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.clockOut = async (req, res) => {
            try {
                const user_id = req.user_id;
                const clockIn = req.body.clockInTime;
                const serviceResponse = await this.workLogService.clockOut(user_id, clockIn);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.clockStatus = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.workLogService.clockStatus(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.breakStart = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.workLogService.clockBreakStart(user_id);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.breakEnd = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.workLogService.clockBreakEnd(user_id);
                res.status(httpStatusCode_1.default.OK).send();
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.scheduleClockStatus = async (req, res) => {
            try {
                const user_id = req.body.user_id;
                const serviceResponse = await this.workLogService.scheduleClockStatus(user_id);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.clockStatistics = async (req, res) => {
            try {
                const user_id = req.user_id;
                const serviceResponse = await this.workLogService.clockStatistics(user_id);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.workLogService = workLogService;
    }
}
exports.default = WorkLogController;
