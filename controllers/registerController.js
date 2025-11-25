import Employee from "../models/Employee.js"
import User from "../models/User.js"
import bcrypt from "bcrypt"

const registerController = async (req, res) => {
    try{
        const {employeeId, employeeEmail, password} = req.body; 
        
        if (!employeeEmail || !employeeEmail || !password ) return res.status(404).json({msg: "Please fill all the details"})
        
        const isEmplyeeRegister = await  User.findOne({employeeId}); 

        if (isEmplyeeRegister)  return res.status(404).json("Employee Already Registered")

        if (!employeeEmail || !employeeEmail || !password ) return res.status(404).json({msg: "Please fill all the details"})
        
            // console.log(employeeId, employeeEmail);
       
        const EmployeeDetails = await Employee.findOne({$and: [{employeeId}, {officialEmail: employeeEmail}]}); 
        console.log(EmployeeDetails)
        if (!EmployeeDetails) {
          return   res.status(400).send({msg: "Employee not found. Please check the given details"});
        } 

        const hashPass = await bcrypt.hash(password, 10);
        const data = new User({employeeId, employeeEmail, password: hashPass, role: EmployeeDetails.roleTitle === "ADMIN"? "ADMIN":"EMPLOYEE"}); 
        await data.save();
       return res.status(200).json({msg: "Registered Successfully"})


        

   
    }catch(error){
        console.log(error);
    }

}

export default registerController;