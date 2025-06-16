import stripe from "../Config/stripe_config";
import Stripe from "stripe";
import { IPaymentRepository } from "../Interfaces/payment.repository.interface";
import { IPaymentService } from "../Interfaces/payment.service.interface";
import { sendInvoiceEmail } from "../Config/email_config";
import { HttpError } from "../Utils/HttpError";
import HTTP_statusCode from "../Enums/httpStatusCode";

class PaymentService implements IPaymentService {
  private paymentRepository: IPaymentRepository;
  constructor(paymentRepository: IPaymentRepository) {
    this.paymentRepository = paymentRepository;
  }
  payment = async (admin_id: string, subscription: string): Promise<string> => {
    try {
      const amount = subscription === "pro" ? 15900 : 2000;
      const interval = subscription === "pro" ? "year" : "month";

      const product = await stripe.products.create({
        name:
          subscription === "pro" ? "Pro Subscription" : "Basic Subscription",
        description:
          subscription === "pro"
            ? "Annual subscription for Pro plan."
            : "Monthly subscription for Basic plan.",
      });

      const price = await stripe.prices.create({
        unit_amount: amount, // Amount in cents
        currency: "usd",
        recurring: {
          interval,
        },
        product: product.id,
      });

      const sessionResponse = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: price.id, // Using the price created earlier
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `https://projecx.online/admin/success`,
        cancel_url: `https://projecx.online/admin/cancel?subscription=${subscription}`,
        metadata: {
          subscription: subscription, // Store the subscription plan type ('pro' or 'basic')
          admin_id: admin_id, // Store the admin ID
          interval: interval, // Store the subscription interval ('month' or 'year')
        },
      });

      const session = sessionResponse as Stripe.Checkout.Session;
      const activeSubscription =
        await this.paymentRepository.activeSubscription(admin_id);
      if (activeSubscription) {
        throw new HttpError(
          HTTP_statusCode.Conflict,
          "You already have a subscription plan"
        );
      }

      if (!session.url) {
        throw new HttpError(
          HTTP_statusCode.InternalServerError,
          "Session URL is null. Unable to proceed."
        );
      }
      return session.url;
    } catch (error: unknown) {
      throw error;
    }
  };
  handleWebHook = async (event: Stripe.Event): Promise<void> => {
    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
          console.log("session", session);
          console.log("checkout.session.completed");
          const paymentIntentId = session.payment_intent as string;
          const subscription = session.metadata?.subscription; // 'pro' or 'basic'
          const interval = session.metadata?.interval; // 'month' or 'year'
          const admin_id = session.metadata?.admin_id;
          const amount = session.amount_total;
          const customer = session.customer as string;

          let endDate: Date = new Date();
          if (interval === "year") {
            endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
          } else if (interval === "month") {
            endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
          }

          if (!admin_id) {
            throw new HttpError(HTTP_statusCode.BadRequest, "No admin data");
          }

          if (!subscription) {
            throw new HttpError(
              HTTP_statusCode.BadRequest,
              "No subscription plan"
            );
          }

          if (!amount) {
            throw new HttpError(HTTP_statusCode.BadRequest, "No amount");
          }
          await this.paymentRepository.payment(
            admin_id,
            subscription,
            amount,
            customer
          );

          console.log("Payment successful! Subscription has been processed.");
          break;

        case "invoice.payment_succeeded":
          const { customer_email, hosted_invoice_url, amount_paid, currency } =
            event.data.object as Stripe.Invoice;

          const customerEmail: string = customer_email ?? ""; // Fallback to empty string if undefined or null
          const invoiceUrl: string = hosted_invoice_url ?? ""; // Fallback to empty string if undefined or null
          const amountPaid: string = (amount_paid / 100).toFixed(2); // Convert cents to dollars
          const currencyDollar: string = currency.toUpperCase(); // Ensure currency is in uppercase

          if (customerEmail) {
            await sendInvoiceEmail(
              customerEmail,
              amountPaid,
              currencyDollar,
              invoiceUrl
            );
          } else {
            console.error("Customer email not found for invoice:");
          }
          break;

        case "customer.subscription.deleted":
          const subscriptionDeleted = event.data.object as Stripe.Subscription;
          const deletedSubscriptionId = subscriptionDeleted.id;
          const customerId = subscriptionDeleted.customer as string;

          await this.paymentRepository.updatePaymentStatus(customerId);

          console.log("Subscription cancellation processed successfully.");
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error: unknown) {
      console.error("Error handling webhook:", error);
      throw error; // Rethrow the error after logging it
    }
  };
}

export default PaymentService;
