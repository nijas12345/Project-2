import { PaymentDoc } from "../Model/paymentModal";

export interface IPaymentRepository{
    activeSubscription(admin_id:string):Promise<PaymentDoc|null>
    payment(
        admin_id: string,
        subscription: string,
        amount: number,
        customer:string
      ): Promise<void>;   
    paymentStatus(admin_id:string,status:string):Promise<PaymentDoc|null>    
    updatePaymentStatus(customer:string):Promise<void>
}