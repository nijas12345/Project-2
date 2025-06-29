"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const baseRepository_1 = __importDefault(require("./base/baseRepository"));
class PaymentRepository extends baseRepository_1.default {
    constructor(paymentModel) {
        super(paymentModel);
        this.paymentModel = (mongoose_1.Model);
        this.payment = async (admin_id, subscription, amount, customer) => {
            try {
                await this.paymentModel.create({
                    admin_id,
                    subscription,
                    amount,
                    status: "active",
                    customer,
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.paymentStatus = async (admin_id, status) => {
            try {
                return await this.findOne({
                    admin_id,
                    status
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.updatePaymentStatus = async (customerId) => {
            try {
                await this.findOneAndUpdate({ customer: customerId, status: "active" }, {
                    status: "cancelled",
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.activeSubscription = async (admin_id) => {
            try {
                return await this.findOne({
                    admin_id,
                    status: "active"
                });
            }
            catch (error) {
                throw error;
            }
        };
        this.paymentModel = paymentModel;
    }
}
exports.default = PaymentRepository;
