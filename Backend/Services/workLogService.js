"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WorkLogServices {
    constructor(workLogRepository) {
        this.clockIn = async (user_id, date) => {
            try {
                return await this.workLogRepository.clockIn(user_id, date);
            }
            catch (error) {
                throw error;
            }
        };
        this.clockOut = async (user_id, clockIn) => {
            try {
                return await this.workLogRepository.clockOut(user_id, clockIn);
            }
            catch (error) {
                throw error;
            }
        };
        this.clockStatus = async (user_id) => {
            try {
                return await this.workLogRepository.clockStatus(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.clockBreakStart = async (user_id) => {
            try {
                return await this.workLogRepository.clockBreakStart(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.clockBreakEnd = async (user_id) => {
            try {
                return await this.workLogRepository.clockBreakEnd(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.scheduleClockStatus = async (user_id) => {
            try {
                return await this.workLogRepository.scheduleClockStatus(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.clockStatistics = async (user_id) => {
            try {
                return await this.workLogRepository.clockStatistics(user_id);
            }
            catch (error) {
                throw error;
            }
        };
        this.workLogRepository = workLogRepository;
    }
}
exports.default = WorkLogServices;
