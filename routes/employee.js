import express from "express"; 
import {
  addingEmployee,
  getNextEmployeeId,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  getProfile,
} from "../controllers/addingEmployeeController.js";
import authentication from "../middleware/Authentication.js";

import {
  attendanceController,
  getTodayStatus,
  getAttendanceByMonth,
} from "../controllers/attendance.js";

import {
  getMonthlyCompensation,
  downloadPayslipPdf,
} from "../controllers/compensationController.js";

import { uploadProfilePic } from "../middleware/uploadProfilePic.js";
import { uploadProfilePhoto, updatingProfile } from "../controllers/employeeProfile.js";

const router = express.Router();




// PROFILE PHOTO
router.post("/profile/photo", authentication, uploadProfilePic.single("photo"), uploadProfilePhoto);


// CREATE EMPLOYEE
router.post("/create", authentication, addingEmployee);

// ATTENDANCE
router.post("/attendance/mark-today", authentication, attendanceController);
router.get("/attendance/status", authentication, getTodayStatus);
router.get("/attendance/month", authentication, getAttendanceByMonth);

// NEXT ID + PROFILE
router.put("/profile", authentication, updatingProfile)
router.get("/next-id", authentication, getNextEmployeeId);
router.get("/profile", authentication, getProfile);

// COMPENSATION
router.get("/compensation/month", authentication, getMonthlyCompensation);
router.get("/compensation/payslip/pdf", authentication, downloadPayslipPdf);

// EMPLOYEE LIST (admin)
router.get("/all", authentication, getAllEmployees);

router.get("/:employeeId", authentication, getEmployeeById);
router.put("/:employeeId", authentication, updateEmployee);

export default router;
