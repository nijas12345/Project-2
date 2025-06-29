"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCronJob = void 0;
const axios_1 = __importDefault(require("axios"));
const userModal_1 = __importDefault(require("../Model/userModal")); // Example: Importing a User model
const node_cron_1 = __importDefault(require("node-cron"));
// Schedule the cron job to run at 11:43:55 PM daily
const startCronJob = () => {
    node_cron_1.default.schedule("59 23 * * *", async () => {
        try {
            // Wait for 5 seconds to ensure it's 11:43:55
            setTimeout(async () => {
                try {
                    // Fetch all users from the database
                    const users = await userModal_1.default.find({});
                    console.log("Users:", users);
                    // Loop through users and make an API call for each
                    users.forEach(async (user) => {
                        try {
                            console.log(`Making API call for user ${user.user_id} at 11:43:55 PM`);
                            // Make the API call with user data
                            const response = await axios_1.default.post("http://localhost:8000/schedule-clockStatus", {
                                user_id: user.user_id, // Passing user_id from the database
                            });
                            console.log("API call response:", response.data);
                        }
                        catch (error) {
                            console.error("Error making API call:", error.message);
                        }
                    });
                }
                catch (error) {
                    console.error("Error fetching users:", error.message);
                }
            }, 5000); // Delay by 5 seconds to ensure it is 11:43:55 PM
        }
        catch (error) {
            console.error("Error scheduling cron job:", error.message);
        }
    });
};
exports.startCronJob = startCronJob;
