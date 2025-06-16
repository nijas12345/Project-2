import { Request, Response } from "express";
import Stripe from "stripe";
import stripe from "../Config/stripe_config";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IPaymentService } from "../Interfaces/payment.service.interface";
import { handleError } from "../Utils/handleError";

class PaymentController{
    private paymentService:IPaymentService;
    constructor(paymentService:IPaymentService){
        this.paymentService = paymentService;
    }
  payment = async (req: Request, res: Response) => {
    try {
      const admin_id = req.admin_id as string;
      const subscription = req.body.subscription;
      const serviceResponse = await this.paymentService.payment(
        admin_id,
        subscription
      );
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error,res)
    }
  };

  handleWebhook = async (req: Request, res: Response) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret
      );

      await this.paymentService.handleWebHook(event);

      res.status(HTTP_statusCode.OK).json({ received: true });
    } catch (error:unknown) {
      handleError(error,res)
    }
  };
}

export default PaymentController