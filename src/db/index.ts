import prisma from "../utils/prisma.utils.js";

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("*************************************************************************************");
    console.log("                       ✅ Successfully Connected To Neon PostgreSQL");
  } catch(err){
    console.error("❌ Error connecting to Neon DB:", err);
    process.exit(1);
  }
};

export default connectDB;