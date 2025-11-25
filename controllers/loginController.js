import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const loginController = async (req, res) => {
    try{
        const {employeeId, password} = req.body; 
        
        if (!employeeId || !password) return res.status(404).json({msg: "Please fill all the details"})
        
        const EmployeeDetails = await  User.findOne({employeeId}); 

        if (!EmployeeDetails) {
           return  res.status(400).send({msg: "Employee not found. Please Register"});
        } 

        const hashPass = await bcrypt.compare(password, EmployeeDetails.password);
        if (hashPass){
            const token =  jwt.sign({userId: EmployeeDetails._id,  employeeId, role: EmployeeDetails.role}, "Secret_Key"); 
            return  res.status(200).json({token, msg: "Login Successfully"}); 


        }
        

        return    res.status(400).json({msg: "Incorrect Password"}); 


       



        

   
    }catch(error){
        console.log(error);
    }

}

export default loginController;