import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log("Get request successful.");
      else
        console.error("Get request failed with status code:", res.statusCode);
    })
    .on("error", (e) => console.error("Error getting request.", e));
});

export default job;
