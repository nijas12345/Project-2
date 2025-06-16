
import express from 'express';
import PaymentController from '../Controllers/paymentController';
import PaymentService from '../Services/paymentServices';
import PaymentRepository from '../Repositories/paymentRepository';
import Payment from '../Model/paymentModal';

const webHookRouter = express.Router();

const paymentRepository = new PaymentRepository(Payment);
const paymentService = new PaymentService(paymentRepository);
const paymentController = new PaymentController(paymentService);

// Stripe requires raw body for signature verification
webHookRouter.post('/', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

export default webHookRouter;
