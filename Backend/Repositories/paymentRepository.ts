import { Model } from "mongoose";
import { IPayment } from "../Interfaces/commonInterface";
import { IPaymentRepository } from "../Interfaces/payment.repository.interface";

class PaymentRepository implements IPaymentRepository {
  private paymentModel = Model<IPayment>;
  constructor(paymentModel: Model<IPayment>) {
    this.paymentModel = paymentModel;
  }
  payment = async (
    admin_id: string,
    subscription: string,
    amount: number,
    customer: string
  ): Promise<void> => {
    try {
      const newPayment = await this.paymentModel.create({
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
  ): Promise<IPayment | null> => {
    try {
      const paymentData: IPayment | null = await this.paymentModel.findOne({
        admin_id: admin_id,
        status: status
      });
      return paymentData;
    } catch (error) {
      throw error;
    }
  };

  updatePaymentStatus = async (customerId: string): Promise<void> => {
    try {
      await this.paymentModel.findOneAndUpdate(
        { customer: customerId, status: "active" },
        {
          status: "cancelled",
        },
        { new: true }
      );
    } catch (error: unknown) {
      throw error;
    }
  };
  activeSubscription = async (admin_id: string): Promise<IPayment | null> => {
    try {
      return await this.paymentModel.findOne({
        status: "active",
        admin_id: admin_id,
      });
    } catch (error: unknown) {
      throw error;
    }
  };
}

export default PaymentRepository;
