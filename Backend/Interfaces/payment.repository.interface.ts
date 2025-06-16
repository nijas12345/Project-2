import { IPayment } from "./commonInterface";

export interface IPaymentRepository{
    activeSubscription(admin_id:string):Promise<IPayment|null>
    payment(
        admin_id: string,
        subscription: string,
        amount: number,
        customer:string
      ): Promise<void>;   
    paymentStatus(admin_id:string,status:string):Promise<IPayment|null>    
    updatePaymentStatus(customer:string):Promise<void>
}