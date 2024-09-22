import cron from "node-cron";
import { Subscription } from "../models/subscriptionModel.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const expiredSubscriptions = await Subscription.find({
      dateFin: { $lt: new Date() },
      status: "updated",
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = "expired";
      await subscription.save();
    }

    console.log("Vérification des abonnements expirés effectuée.");
  } catch (error) {
    console.error(
      "Erreur lors de la vérification des abonnements expirés:",
      error
    );
  }
});
