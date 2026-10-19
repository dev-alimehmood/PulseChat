import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/user.models.js";
import { MONGODB_URI } from "./config/config.js";

async function check() {
  await mongoose.connect(MONGODB_URI);
  const users = await User.find({ pushSubscriptions: { $exists: true, $not: { $size: 0 } } });
  console.log("Users with subscriptions:", users.length);
  for (const u of users) {
    const unique = [];
    const seen = new Set();
    for (const sub of (u.pushSubscriptions || [])) {
      if (sub && sub.endpoint && !seen.has(sub.endpoint)) {
        seen.add(sub.endpoint);
        unique.push(sub);
      }
    }
    if (unique.length !== u.pushSubscriptions.length) {
      console.log(`User ${u.full_name || u._id}: cleaned duplicate subscriptions from ${u.pushSubscriptions.length} down to ${unique.length}`);
      await User.findByIdAndUpdate(u._id, { pushSubscriptions: unique });
    } else {
      console.log(`User ${u.full_name || u._id}: ${unique.length} unique subscriptions`);
    }
  }
  mongoose.disconnect();
}
check();
