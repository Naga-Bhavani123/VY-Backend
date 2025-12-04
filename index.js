import express from "express"; 
import mongoose from "mongoose";
import auth from "./routes/auth.js"
import employee from "./routes/employee.js"
import cors from "cors";
import dotenv from "dotenv"

dotenv.config()


const app = express(); 
app.use(cors());
const connection = async () => {
    app.listen(3000, () => console.log("server connected")); 

    await mongoose.connect("mongodb+srv://VY_payroll:VY_123@cluster0.rcjpjla.mongodb.net/payroll")
    .then(()  => console.log("Database connected"))
    .catch((error) => console.log(error)); 
}
connection()
app.use(express.json()); 


app.use("/auth", auth); 
app.use("/employee", employee);

