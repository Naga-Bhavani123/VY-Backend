import mongoose from "mongoose"; 

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true }, // E001 etc.
    employeeName: { type: String, required: true },
    officialEmail: { type: String, required: true, unique: true },
    roleTitle: { type: String },
    
    // "Developer", "HR Executive"
    contactNumber: {
        type:String
    },
    profilePhotoUrl: { type: String, default: "" },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true })


const EmployeeModel = mongoose.model("employee", employeeSchema); 
export default EmployeeModel; 