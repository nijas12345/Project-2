"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class MeetingRepository extends baseRepository_1.default {
    constructor(meetingModel) {
        super(meetingModel);
        this.meetingModel = (mongoose_1.Model);
        this.scheduleMeetings = async (meetingData) => {
            try {
                return await this.meetingModel.create(meetingData);
            }
            catch (error) {
                throw error;
            }
        };
        this.fetchMeetings = async (userEmail, projectId) => {
            try {
                return await this.meetingModel.find({
                    "members.email": userEmail,
                    projectId: projectId,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.AdminfetchMeetings = async (admin_id, projectId) => {
            try {
                return await this.meetingModel.find({
                    admin_id: admin_id,
                    projectId: projectId,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updateMeetingStatus = async (meetingId, status) => {
            try {
                return await this.findOneAndUpdate({ meetingId }, {
                    status
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.meetingModel = meetingModel;
    }
}
exports.default = MeetingRepository;
