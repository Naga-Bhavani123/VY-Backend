import express from "express"; 
import {addingEmployee, getNextEmployeeId, getAllEmployees, getEmployeeById, updateEmployee}  from "../controllers/addingEmployeeController.js";
import authentication from "../Authentication.js";
import {attendanceController, getTodayStatus, getAttendanceByMonth} from "../controllers/attendance.js"
import {
  getMonthlyCompensation,
  downloadPayslipPdf,
} from "../controllers/compensationController.js";

const router = express.Router(); 


router.post("/create", authentication, addingEmployee);
router.post("/attendance/mark-today", authentication, attendanceController);
router.get("/attendance/status", authentication, getTodayStatus);
router.get("/attendance/month", authentication, getAttendanceByMonth);
router.get("/next-id", authentication, getNextEmployeeId);
router.get("/all", authentication, getAllEmployees)
router.get("/:employeeId", authentication,getEmployeeById ); 
router.put("/:employeeId", authentication, updateEmployee);
router.get("/compensation/month", authentication, getMonthlyCompensation);
router.get("/compensation/payslip/pdf", authentication, downloadPayslipPdf);


export default router;