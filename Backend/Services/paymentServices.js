"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_config_1 = __importDefault(require("../Config/stripe_config"));
const email_config_1 = require("../Config/email_config");
const HttpError_1 = require("../Utils/HttpError");
const httpStatusCode_1 = __importDefault(require("../Enums/httpStatusCode"));
class PaymentService {
    constructor(paymentRepository) {
        this.payment = async (admin_id, subscription) => {
            try {
                const amount = subscription === "pro" ? 15900 : 2000;
                const interval = subscription === "pro" ? "year" : "month";
                const product = await stripe_config_1.default.products.create({
                    name: subscription === "pro" ? "Pro Subscription" : "Basic Subscription",
                    description: subscription === "pro"
                        ? "Annual subscription for Pro plan."
                        : "Monthly subscription for Basic plan.",
                });
                const price = await stripe_config_1.default.prices.create({
                    unit_amount: amount, // Amount in cents
                    currency: "usd",
                    recurring: {
                        interval,
                    },
                    product: product.id,
                });
                const sessionResponse = await stripe_config_1.default.checkout.sessions.create({
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
                const session = sessionResponse;
                const activeSubscription = await this.paymentRepository.activeSubscription(admin_id);
                if (activeSubscription) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.Conflict, "You already have a subscription plan");
                }
                if (!session.url) {
                    throw new HttpError_1.HttpError(httpStatusCode_1.default.InternalServerError, "Session URL is null. Unable to proceed.");
                }
                return session.url;
            }
            catch (error) {
                throw error;
            }
        };
        this.handleWebHook = async (event) => {
            try {
                switch (event.type) {
                    case "checkout.session.completed":
                        const session = event.data.object;
                        console.log("session", session);
                        console.log("checkout.session.completed");
                        const paymentIntentId = session.payment_intent;
                        const subscription = session.metadata?.subscription; // 'pro' or 'basic'
                        const interval = session.metadata?.interval; // 'month' or 'year'
                        const admin_id = session.metadata?.admin_id;
                        const amount = session.amount_total;
                        const customer = session.customer;
                        let endDate = new Date();
                        if (interval === "year") {
                            endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
                        }
                        else if (interval === "month") {
                            endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
                        }
                        if (!admin_id) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No admin data");
                        }
                        if (!subscription) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No subscription plan");
                        }
                        if (!amount) {
                            throw new HttpError_1.HttpError(httpStatusCode_1.default.BadRequest, "No amount");
                        }
                        await this.paymentRepository.payment(admin_id, subscription, amount, customer);
                        console.log("Payment successful! Subscription has been processed.");
                        break;
                    case "invoice.payment_succeeded":
                        const { customer_email, hosted_invoice_url, amount_paid, currency } = event.data.object;
                        const customerEmail = customer_email ?? ""; // Fallback to empty string if undefined or null
                        const invoiceUrl = hosted_invoice_url ?? ""; // Fallback to empty string if undefined or null
                        const amountPaid = (amount_paid / 100).toFixed(2); // Convert cents to dollars
                        const currencyDollar = currency.toUpperCase(); // Ensure currency is in uppercase
                        if (customerEmail) {
                            await (0, email_config_1.sendInvoiceEmail)(customerEmail, amountPaid, currencyDollar, invoiceUrl);
                        }
                        else {
                            console.error("Customer email not found for invoice:");
                        }
                        break;
                    case "customer.subscription.deleted":
                        const subscriptionDeleted = event.data.object;
                        const deletedSubscriptionId = subscriptionDeleted.id;
                        const customerId = subscriptionDeleted.customer;
                        await this.paymentRepository.updatePaymentStatus(customerId);
                        console.log("Subscription cancellation processed successfully.");
                        break;
                    default:
                        console.log(`Unhandled event type: ${event.type}`);
                }
            }
            catch (error) {
                console.error("Error handling webhook:", error);
                throw error; // Rethrow the error after logging it
            }
        };
        this.paymentRepository = paymentRepository;
    }
}
exports.default = PaymentService;
