import Attendance from "../models/Attendance.js"

function gettingDate(){
    const currentDateTime = new Date(); 
    const day = String(currentDateTime.getDate()).padStart(2, "0");
    const month = String(currentDateTime.getMonth() + 1).padStart(2, "0");
    const year = currentDateTime.getFullYear();

    const hours = String(currentDateTime.getHours()).padStart(2, "0");
    const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
    const seconds = String(currentDateTime.getSeconds()).padStart(2, "0");
    
    const AMORPM = hours >= 12?"PM":"AM"; 
    const conversionOf12Hours = hours % 12 ||12;

    return {
         date: `${day}/${month}/${year}`,
         time: `${conversionOf12Hours}:${minutes}:${seconds} ${AMORPM}`
    }
}


export const attendanceController = async (req, res) => {
  try {
    const user = req.user;
    const employeeId = user.employeeId;
    const { mode } = req.body;
    const {date, time} = gettingDate();
    console.log(date, time)
    const attendance = await Attendance.findOne({ employeeId, date});

    console.log(attendance)
    if (mode === "CHECK_IN") {

      if (attendance) return res.status(400).json({ msg: "Already checked in", isApproved: attendance.isApproved });

      await Attendance.create({
        employeeId,
        date,
        status: "PRESENT",
        checkInTime: time,
        isApproved: false
      });

      return res.json({ msg: "Checked In Successfully",  isApproved: false });
    }

    if (mode === "CHECK_OUT") {
      if (!attendance) return res.status(400).json({ msg: "Check in first" });
      if (attendance.checkOutTime)
        return res.status(400).json({ msg: "Already checked out"});

      attendance.checkOutTime = time;
      attendance.isApproved = true;
      await attendance.save();

      return res.json({ msg: "Checked Out Successfully" });
    }

    return res.status(400).json({ msg: "Invalid Operation" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error" });
  }
};


export const getTodayStatus = async (req, res) => {
  try {
    const employeeId = req.user.employeeId;
    const {date, time} = gettingDate()
    const attendance = await Attendance.findOne({$and: [{ employeeId, date }]});
    if (!attendance) {
      return res.json({
        nextAction: "CHECK_IN",
        msg: "No attendance marked yet for today",
      });
    }

    if (!attendance.checkOutTime) {
      return res.json({
        nextAction: "CHECK_OUT",
        msg: "You have checked in, please check out at end of day",
      });
    }

    return res.json({
      nextAction: "DONE",
      msg: "Attendance completed for today",
      isApproved: attendance.isApproved,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Error fetching today status" });
  }
};



export const getAttendanceByMonth = async (req, res) => {
  try {
    const employeeId = req.user.employeeId; // from JWT middleware
    const { year, month } = req.query;  
    const { date, time} = gettingDate();
    if (!year || !month) {
      return res
        .status(400)
        .json({ msg: "year and month are required query params" });
    }

    const monthNum = Number(month);
    if (Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return res.status(400).json({ msg: "month must be between 1 and 12" });
    }

    const monthPadded = String(monthNum).padStart(2, "0");  // "11"
    const suffix = `${monthPadded}/${year}`;            // "2025/11"

    // 1) Get all records for that employee + month
    const records = await Attendance.find({
      employeeId,
      date: { $regex: `${suffix}$` },   // matches "27/11/2025", "2025-11-02", ...
    }).sort({ date: 1 });
    console.log(records)
    // 2) Put into a map for quick lookup
    const mapByDate = {};

    records.forEach((rec) => {
      if (rec.isApproved) mapByDate[rec.date] = rec;
    });

    // 3) Work out days in that month
    const daysInMonth = new Date(Number(year), monthNum, 0).getDate(); // last day

    const days = [];
   
  const today = new Date();  // current full date
for (let day = 1; day <= daysInMonth; day++) {
  const dayStr = String(day).padStart(2, "0");
  const dateStr = `${dayStr}/${monthPadded}/${year}`;
     // "03/11/2025"
  const currentDate = new Date(`${year}-${monthPadded}-${dayStr}`);
  
  const existing = mapByDate[dateStr];
  
 if (currentDate.getDay() === 0){
  days.push({
      date: dateStr,
      day,
      status: "WEEKLY_OFF",
      checkInTime: null,
      checkOutTime: null,
      isApproved: null,
    });
 }

  else if (currentDate > today) {
    // FUTURE DAY → show Yet to mark
    days.push({
      date: dateStr,
      day,
      status: "YET_TO_MARK",
      checkInTime: null,
      checkOutTime: null,
      isApproved: null,
    });
  } else if (existing) {
    // record exists → real status
    days.push({
      date: dateStr,
      day,
      status: existing.status || "PRESENT",
      checkInTime: existing.checkInTime || null,
      checkOutTime: existing.checkOutTime || null,
      isApproved: existing.isApproved ?? null,
    });
  } else {
    // NOT future, NOT present → ABSENT
    days.push({
      date: dateStr,
      day,
      status: "ABSENT",
      checkInTime: null,
      checkOutTime: null,
      isApproved: null,
    });
  }
}

    return res.json({
      msg: "Attendance month data",
      employeeId,
      year: Number(year),
      month: monthNum,
      days,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error fetching month attendance" });
  }
};



