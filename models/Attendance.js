import mongoose from "mongoose";

const attendenceModel = new mongoose.Schema({
    employeeId:{
        type: String,
        ref:  "employee"

    }
        ,
    date: String,
    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "LEAVE"],
      default: "ABSENT",
    },
    checkInTime: String,
    checkOutTime: String,

    isApproved: {
      type: Boolean,
      default: false,   // important 
    },
  },
  { timestamps: true })

const model = mongoose.model("attendence", attendenceModel);
export default model;