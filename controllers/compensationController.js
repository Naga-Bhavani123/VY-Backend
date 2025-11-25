import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";

function getWorkingDaysExcludingSundays(year, monthNum) {
  // monthNum is 1–12
  const daysInMonth = new Date(year, monthNum, 0).getDate(); // last date of month
  let workingDays = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    // JS months are 0-based → monthNum - 1
    const currentDate = new Date(year, monthNum - 1, day);
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday

    if (dayOfWeek !== 0) {
      // not Sunday
      workingDays++;
    }
  }

  return workingDays;
}


// GET /employee/compensation/month?year=2025&month=11
export const getMonthlyCompensation = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;  // from JWT
    const { year, month } = req.query;       // month: 1–12

    if (!year || !month) {
      return res.status(400).json({ msg: "year and month are required" });
    }

    const monthNum = Number(month);
    if (Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ msg: "month must be between 1 and 12" });
    }

    // get employee salary details
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const { basicSalary, hra, allowances } = employee;

    const monthPadded = String(monthNum).padStart(2, "0");
    const datePrefix = `${year}-${monthPadded}`; // "2025-11"

    // Get attendance for that month (only APPROVED ones)
    const records = await Attendance.find({
      employeeId,
      date: { $regex: `^${datePrefix}` },
    });

    let presentDays = 0;
    let absentDays = 0;

    records.forEach((rec) => {
      if (rec.isApproved && rec.status === "PRESENT") {
        presentDays += 1;
      } else if (rec.status === "ABSENT") {
        absentDays += 1;
      }
    });

    // total days in month

    // you can decide workingDays logic (exclude Sundays if you want later)
    const workingDays = getWorkingDaysExcludingSundays(Number(year), monthNum);

    const grossMonthly = basicSalary + hra + allowances;

    // per day salary
    const perDay = grossMonthly / workingDays;

    // earnings based on present days
    const earningsForPresentDays = perDay * presentDays;

    // dummy deductions (you can change later)
    let pf = 0; // 12% PF
    let calculatedPf =  Math.round(grossMonthly * 0.12);
    if (calculatedPf < earningsForPresentDays) pf = calculatedPf
    let tax = 0;

if (earningsForPresentDays > 50000 && earningsForPresentDays <= 100000) {
  tax = Math.round(earningsForPresentDays * 0.05);
} else if (earningsForPresentDays > 100000) {
  tax = Math.round(earningsForPresentDays * 0.10);
}      
   
const totalDeductions = pf + tax;

    // net pay (you can also base on earningsForPresentDays if you want)
    const netPay = Math.round(earningsForPresentDays - totalDeductions);

    return res.json({
      employeeId,
      year: Number(year),
      month: monthNum,
      presentDays,
      absentDays,
      workingDays,
      basicSalary,
      hra,
      allowances,
      grossMonthly,
      perDay: Math.round(perDay),
      earningsForPresentDays: Math.round(earningsForPresentDays),
      pf,
      tax,
      totalDeductions,
      netPay,
      companyName: "VY",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error fetching monthly compensation" });
  }
};


import PDFDocument from "pdfkit";

// GET /employee/compensation/payslip/pdf?year=2025&month=11
export const downloadPayslipPdf = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ msg: "year and month are required" });
    }

    // reuse logic: you can call getMonthlyCompensation calculation here
    // Better: move calculation to a helper function

    // --- copy same logic here short version ---
    const monthNum = Number(month);
    const monthPadded = String(monthNum).padStart(2, "0");
    const datePrefix = `${year}-${monthPadded}`;

    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const { basicSalary, hra, allowances, employeeName } = employee;

    const records = await Attendance.find({
      employeeId,
      date: { $regex: `^${datePrefix}` },
    });

    let presentDays = 0;
    let absentDays = 0;

    records.forEach((rec) => {
      if (rec.isApproved && rec.status === "PRESENT") {
        presentDays += 1;
      } else if (rec.status === "ABSENT") {
        absentDays += 1;
      }
    });

    const workingDays = getWorkingDaysExcludingSundays(Number(year), monthNum);

    const grossMonthly = basicSalary + hra + allowances;
    const perDay = grossMonthly / workingDays;
    const earningsForPresentDays = perDay * presentDays;
     let pf = 0; // 12% PF
    let calculatedPf =  Math.round(grossMonthly * 0.12);
    if (calculatedPf < earningsForPresentDays) pf = calculatedPf

let tax = 0;

if (earningsForPresentDays > 50000 && earningsForPresentDays <= 100000) {
  tax = Math.round(earningsForPresentDays * 0.05);
} else if (earningsForPresentDays > 100000) {
  tax = Math.round(earningsForPresentDays * 0.10);
}    const totalDeductions = pf + tax;
    const netPay = Math.round(earningsForPresentDays - totalDeductions);
   console.log(tax)
    // --- Create PDF ---
    const doc = new PDFDocument({ margin: 50 });

    // set headers for download
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Payslip_${employeeId}_${year}-${monthPadded}.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // Company + header
    doc
      .fontSize(20)
      .text("VY - Monthly Payslip", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Employee ID: ${employeeId}`)
      .text(`Employee Name: ${employeeName}`)
      .text(`Month: ${monthPadded}-${year}`)
      .moveDown(1);

    doc
      .fontSize(12)
      .text(`Present Days: ${presentDays}`)
      .text(`Absent Days: ${absentDays}`)
      .text(`Working Days: ${workingDays}`)
      .moveDown(1);

    doc.fontSize(14).text("Earnings", { underline: true }).moveDown(0.5);
    doc
      .fontSize(12)
      .text(`Basic Salary: ${basicSalary}`)
      .text(`HRA: ${hra}`)
      .text(`Allowances: ${allowances}`)
      .text(`Per Day: ${Math.round(perDay)}`)
      .text(`Earnings for Present Days: ${Math.round(earningsForPresentDays)}`)
      .moveDown(1);

    doc.fontSize(14).text("Deductions", { underline: true }).moveDown(0.5);
    doc
      .fontSize(12)
      .text(`PF: ${pf}`)
      .text(`Tax: ${tax}`)
      .text(`Total Deductions: ${totalDeductions}`)
      .moveDown(1);

    doc
      .fontSize(14)
      .text(`Net Pay: ${netPay}`, { align: "right" })
      .moveDown(2);

    doc.text("This is a system generated payslip from VY.", { align: "center" });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error generating payslip PDF" });
  }
};
