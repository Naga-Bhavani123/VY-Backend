import Employee from "../models/Employee.js"; 


export const addingEmployee = async (req, res) => {
    try{

        const adminDetails = req.user; 
        if (adminDetails.role != "ADMIN") return res.status(400).json({msg: "Admin can only create employees"})

        const {employeeId, employeeName, roleTitle, basicSalary, isActive, hra, officialEmail,allowances} = req.body; 

        if (!employeeId||!employeeName||!roleTitle||!basicSalary||!isActive||!hra ||!officialEmail || !allowances)  res.status(404).json({msg: "Please fill all the details"}) 
        
        const isEmployeeEmail = await Employee.findOne({officialEmail})
        if (isEmployeeEmail) return res.status(400).json({msg:`Email is already created for employee ${isEmployeeEmail.employeeId}`});

       
        const updatedData = Employee({employeeId, employeeName, roleTitle, basicSalary, isActive, hra, officialEmail,allowances})
        await updatedData.save(); 
        return res.status(200).json({msg:"Employee is created"});

    }catch(error){
        console.log(error)
    }
}

// GET /employees/next-id
export const getNextEmployeeId = async (req, res) => {
  try {
    // Only admin allowed
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Only admin can get next employee ID" });
    }

    const prefix = "VY";    // employee id format like VY0001
    const width = 4;        // total digits 4

    const totalEmployees = await Employee.countDocuments();  // count total docs

    const nextNumber = totalEmployees + 1; // add one

    const nextId = prefix + String(nextNumber).padStart(width, "0"); // format

    return res.json({ employeeId: nextId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error generating employee ID" });
  }
};


export const getAllEmployees = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Only admin can view employees" });
    }

    const { search } = req.query;

    let filter = {};

    if (search && search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i"); // case-insensitive
      filter = {
        $or: [
          { employeeId: regex },
          { employeeName: regex },
          { officialEmail: regex },
          { roleTitle: regex },
        ],
      };
    }

    const employees = await Employee.find(filter).sort({ createdAt: -1 });

    return res.json({ employees });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error fetching employees" });
  }
};

// GET /employee/:employeeId
export const getEmployeeById = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({ msg: "Only admin can view employees" });
    }

    const { employeeId } = req.params;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    return res.json({ employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error fetching employee" });
  }
};

// PUT /employee/:employeeId
export const updateEmployee = async (req, res) => {
  try {
   

    const { employeeId } = req.params;

    const {
      employeeName,
      officialEmail,
      roleTitle,
      contactNumber,
      basicSalary,
      hra,
      allowances,
      isActive,
    } = req.body;

    const employee = await Employee.findOne({ employeeId });

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // update allowed fields
    if (employeeName !== undefined) employee.employeeName = employeeName;
    if (officialEmail !== undefined) employee.officialEmail = officialEmail;
    if (roleTitle !== undefined) employee.roleTitle = roleTitle;
    if (contactNumber !== undefined) employee.contactNumber = contactNumber;
    if (basicSalary !== undefined) employee.basicSalary = basicSalary;
    if (hra !== undefined) employee.hra = hra;
    if (allowances !== undefined) employee.allowances = allowances;
    if (typeof isActive === "boolean") employee.isActive = isActive;

    await employee.save();

    return res.json({ msg: "Employee updated successfully", employee });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error updating employee" });
  }
};


export const getProfile  = async (req, res) => {
      try{

        const {employeeId} = req.user; 
        const response = await Employee.findOne({employeeId}); 
        res.send(response)

      }catch(error){
        res.status(500).json({msg: "Something went wrong"})
      }
}