import axios from "axios";
import User from "../Model/userModal"; // Example: Importing a User model
import cron from "node-cron";
import dotenv from 'dotenv'
dotenv.config()

const apiCall = process.env.BACKEND_URL
// Schedule the cron job to run at 11:43:55 PM daily
const startCronJob = () => {
  cron.schedule("59 23 * * *", async () => {

    try {
      // Wait for 5 seconds to ensure it's 11:43:55
      setTimeout(async () => {
        try {
          // Fetch all users from the database
          const users = await User.find({});
          console.log("Users:", users);

          // Loop through users and make an API call for each
          users.forEach(async (user) => {
            try {
              console.log(
                `Making API call for user ${user.user_id} at 11:43:55 PM`
              );

              // Make the API call with user data
              const response = await axios.post(
                apiCall + "/schedule-clockStatus",
                {
                  user_id: user.user_id, // Passing user_id from the database
                }
              );

              console.log("API call response:", response.data);
            } catch (error: any) {
              console.error("Error making API call:", error.message);
            }
          });
        } catch (error: any) {
          console.error("Error fetching users:", error.message);
        }
      }, 5000); // Delay by 5 seconds to ensure it is 11:43:55 PM
    } catch (error: any) {
      console.error("Error scheduling cron job:", error.message);
    }
  });
};

export { startCronJob };
