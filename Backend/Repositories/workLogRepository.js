"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class WorkLogRepository extends baseRepository_1.default {
    constructor(workLog) {
        super(workLog);
        this.workLog = (mongoose_1.Model);
        this.clockIn = async (user_id) => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                if (existingClockData) {
                    const newClockInTime = new Date();
                    const updatedClockData = await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, { $set: { clockIn: newClockInTime, isClockedIn: true } }, { new: true });
                    return updatedClockData ? updatedClockData.workDuration : 0;
                }
                else {
                    const now = new Date();
                    const clockData = {
                        user_id: user_id,
                        date: now,
                        clockIn: now,
                        clockOut: now,
                        workDuration: 0,
                        breakDuration: 0,
                        isClockedIn: true,
                        isOnBreak: false,
                        breakStart: now,
                        breakEnd: now,
                    };
                    const newClockData = await this.workLog.create(clockData);
                    return newClockData.date;
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.clockOut = async (user_id) => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id: user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                if (!existingClockData || !existingClockData.clockIn) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No clock-in data found for this user today.");
                }
                const now = new Date();
                const differenceInMs = now.getTime() - existingClockData.clockIn.getTime();
                console.log(differenceInMs);
                const newWorkDuration = existingClockData.workDuration + differenceInMs;
                const updatedClockData = await this.findOneAndUpdate({ user_id, date: { $gte: startOfDay, $lte: endOfDay } }, {
                    $set: {
                        clockOut: now,
                        workDuration: newWorkDuration,
                        isClockedIn: false,
                    },
                }, { new: true });
                return updatedClockData ? updatedClockData.workDuration : 0;
            }
            catch (error) {
                throw error;
            }
        };
        this.clockStatus = async (user_id) => {
            try {
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id: user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                if (!existingClockData || !existingClockData.clockIn) {
                    return null;
                }
                if (existingClockData.isClockedIn == true) {
                    const now = new Date();
                    const differenceInMs = now.getTime() - existingClockData.clockIn.getTime();
                    console.log("difference", differenceInMs);
                    const newWorkDuration = differenceInMs + existingClockData.workDuration;
                    const updatedClockData = await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, {
                        $set: {
                            clockOut: now,
                            clockIn: now,
                            workDuration: newWorkDuration,
                        },
                    }, { new: true });
                    return updatedClockData;
                }
                if (existingClockData.isOnBreak) {
                    const now = new Date();
                    const differenceInMs = now.getTime() - existingClockData.breakStart.getTime();
                    console.log("difference", differenceInMs);
                    const newbreakDuration = differenceInMs + existingClockData.breakDuration;
                    const updatedClockData = await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, { $set: { breakStart: now, breakDuration: newbreakDuration } }, { new: true });
                    return updatedClockData;
                }
                return existingClockData;
            }
            catch (error) {
                throw error;
            }
        };
        this.clockBreakStart = async (user_id) => {
            try {
                const now = new Date();
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                if (!existingClockData || !existingClockData.clockIn) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No data exists for this user");
                }
                if (existingClockData) {
                    const updatedClockData = await this.workLog.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, { $set: { breakStart: now, isOnBreak: true } }, { new: true });
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.clockBreakEnd = async (user_id) => {
            try {
                const now = new Date();
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                console.log("breakEnd", existingClockData);
                if (!existingClockData || !existingClockData.clockIn) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.NotFound, "No clock-in data exists for this user");
                }
                if (existingClockData) {
                    const differenceInMs = now.getTime() - existingClockData.breakStart.getTime();
                    const newBreakDuration = existingClockData.breakDuration + differenceInMs;
                    await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, {
                        $set: {
                            breakEnd: now,
                            breakDuration: newBreakDuration,
                            isOnBreak: false,
                        },
                    }, { new: true });
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.scheduleClockStatus = async (user_id) => {
            try {
                const now = new Date();
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date();
                endOfDay.setHours(23, 59, 59, 999);
                const existingClockData = await this.findOne({
                    user_id,
                    date: { $gte: startOfDay, $lte: endOfDay },
                });
                if (existingClockData?.isClockedIn) {
                    const differenceInMs = now.getTime() - existingClockData.clockIn.getTime();
                    const newWorkDuration = existingClockData.workDuration + differenceInMs;
                    const updatedClockData = await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, {
                        $set: {
                            clockOut: now,
                            workDuration: newWorkDuration,
                            isClockedIn: false,
                        },
                    }, { new: true });
                }
                if (existingClockData?.isOnBreak) {
                    const differenceInMs = now.getTime() - existingClockData.breakStart.getTime();
                    const newBreakDuration = existingClockData.breakDuration + differenceInMs;
                    await this.findOneAndUpdate({ user_id: user_id, date: { $gte: startOfDay, $lte: endOfDay } }, {
                        $set: {
                            breakEnd: now,
                            breakDuration: newBreakDuration,
                            isOnBreak: false,
                        },
                    }, { new: true });
                }
            }
            catch (error) {
                throw error;
            }
        };
        this.clockStatistics = async (user_id) => {
            try {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                const statisticsDate = await this.workLog
                    .find({
                    user_id: user_id,
                    date: { $gte: sevenDaysAgo },
                })
                    .sort({ date: -1 });
                return statisticsDate;
            }
            catch (error) {
                throw error;
            }
        };
        this.workLog = workLog;
    }
}
exports.default = WorkLogRepository;
