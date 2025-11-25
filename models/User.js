import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    employeeId: {
        type:String,
        ref: "employee"
    }, 
    employeeEmail: {
        type:String,
        require: true, 
        unique: true
    }, 
    password: {
           type:String,
        require: true, 
    }, 
    role: { type: String, enum: ["ADMIN", "EMPLOYEE"], required: true }
})

const userModel = mongoose.model("user", userSchema); 

export default userModel;