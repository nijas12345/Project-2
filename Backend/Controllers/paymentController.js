"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_config_1 = __importDefault(require("../Config/stripe_config"));
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
const handleError_1 = require("../Utils/handleError");
class PaymentController {
    constructor(paymentService) {
        this.payment = async (req, res) => {
            try {
                const admin_id = req.admin_id;
                const subscription = req.body.subscription;
                const serviceResponse = await this.paymentService.payment(admin_id, subscription);
                res.status(httpStatusCode_1.default.OK).json(serviceResponse);
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.handleWebhook = async (req, res) => {
            const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
            const signature = req.headers["stripe-signature"];
            let event;
            try {
                event = stripe_config_1.default.webhooks.constructEvent(req.body, signature, webhookSecret);
                await this.paymentService.handleWebHook(event);
                res.status(httpStatusCode_1.default.OK).json({ received: true });
            }
            catch (error) {
                (0, handleError_1.handleError)(error, res);
            }
        };
        this.paymentService = paymentService;
    }
}
exports.default = PaymentController;
