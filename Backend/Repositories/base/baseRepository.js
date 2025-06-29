"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class BaseRepository {
    constructor(model) {
        // ✅ Create
        this.createData = async (data) => {
            try {
                const createData = await this.model.create(data);
                console.log(createData);
                return createData;
            }
            catch (error) {
                throw error;
            }
        };
        // ✅ Find one
        this.findOne = async (filter, projection = {}, options = {}) => {
            try {
                return await this.model.findOne(filter, projection, options);
            }
            catch (error) {
                throw error;
            }
        };
        this.findByIdAndUpdate = async (id, update, options = { new: true }) => {
            try {
                const objectId = typeof id === "string" ? new mongoose_1.default.Types.ObjectId(id) : id;
                return await this.model.findByIdAndUpdate(objectId, update, options);
            }
            catch (error) {
                throw error;
            }
        };
        // ✅ Find all
        this.findAll = async (filter = {}, projection = {}, options = {}) => {
            try {
                return await this.model.find(filter, projection, options);
            }
            catch (error) {
                throw error;
            }
        };
        // ✅ Find by ID
        this.findById = async (id, projection = {}, options = {}) => {
            try {
                const objectId = typeof id === "string" ? new mongoose_1.default.Types.ObjectId(id) : id;
                return await this.model.findById(objectId, projection, options);
            }
            catch (error) {
                throw error;
            }
        };
        // ✅ Find one and update (returns updated)
        this.findOneAndUpdate = async (filter, update, options = { new: true }) => {
            try {
                return await this.model.findOneAndUpdate(filter, update, options);
            }
            catch (error) {
                throw error;
            }
        };
        // ✅ Delete one
        this.deleteOne = async (filter) => {
            try {
                await this.model.deleteOne(filter);
            }
            catch (error) {
                throw error;
            }
        };
        this.model = model;
    }
}
exports.default = BaseRepository;
