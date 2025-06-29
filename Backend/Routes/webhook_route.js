"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = __importDefault(require("../Controllers/paymentController"));
const paymentServices_1 = __importDefault(require("../Services/paymentServices"));
const paymentRepository_1 = __importDefault(require("../Repositories/paymentRepository"));
const paymentModal_1 = __importDefault(require("../Model/paymentModal"));
const webHookRouter = express_1.default.Router();
const paymentRepository = new paymentRepository_1.default(paymentModal_1.default);
const paymentService = new paymentServices_1.default(paymentRepository);
const paymentController = new paymentController_1.default(paymentService);
// Stripe requires raw body for signature verification
webHookRouter.post('/', express_1.default.raw({ type: 'application/json' }), paymentController.handleWebhook);
exports.default = webHookRouter;
