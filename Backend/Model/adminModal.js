"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    admin_id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    profileImage: {
        type: String,
        default: null,
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    companyId: {
        type: String,
    },
    position: {
        type: String,
    },
    city: {
        type: String,
    },
});
const Admin = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = Admin;
