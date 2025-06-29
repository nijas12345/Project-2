import { Model } from "mongoose";
import { IPaymentRepository } from "../Interfaces/payment.repository.interface";
import paymentModel, { PaymentDoc } from "../Model/paymentModal";
import BaseRepository from "./base/baseRepository";

class PaymentRepository extends BaseRepository<PaymentDoc> implements IPaymentRepository {
  private paymentModel = Model<PaymentDoc>;
  constructor(paymentModel: Model<PaymentDoc>) {
    super(paymentModel)
    this.paymentModel = paymentModel;
  }
  payment = async (
    admin_id: string,
    subscription: string,
    amount: number,
    customer: string
  ): Promise<void> => {
    try {
       await this.paymentModel.create({
        admin_id,
        subscription,
        amount,
        status: "active",
        customer,
      });
    } catch (error: unknown) {
      throw error;
    }
  };

  paymentStatus = async (
    admin_id: string,
    status: string
  ): Promise<PaymentDoc | null> => {
    try {
      return await this.findOne({
        admin_id,
        status
      });
    } catch (error) {
      throw error;
    }
  };

  updatePaymentStatus = async (customerId: string): Promise<void> => {
    try {
      await this.findOneAndUpdate(
        { customer: customerId, status: "active" },
        {
          status: "cancelled",
        }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  activeSubscription = async (admin_id: string): Promise<PaymentDoc | null> => {
    try {
      return await this.findOne({
        admin_id,
        status: "active"
      });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default PaymentRepository;
