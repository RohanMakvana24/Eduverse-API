import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/database/Dbconnect.js";
import { cloudinary } from "./config/cloudinary/cloudinary.js";
const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Test Cloudinary
    await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected");

    // 3. Import Express App after connections
    const { default: app } = await import("./app.js");

    // 4. Start Server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Startup Error:", err);
    process.exit(1);
  }
};

startServer();
