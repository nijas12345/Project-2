import Stripe from "stripe"

export interface IPaymentService{
    payment(admin_id:string,subscription:string):Promise<string>
    handleWebHook(event:Stripe.Event):Promise<void>
};