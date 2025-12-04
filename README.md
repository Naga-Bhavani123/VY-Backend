Here is your **complete professional README.md for the Backend ONLY** — clean, well-structured, and perfect for GitHub.
You can copy–paste directly into your **Backend/README.md** file.

---

#  Payroll Management System – Backend

Backend for a full-featured payroll management system built using **Node.js, Express.js, MongoDB, JWT, Multer, Cloudinary & PDFKit**.
Handles employee management, authentication, attendance tracking, salary calculations, profile photo upload, and payslip generation.

---

#  Features (Backend)

###  **Authentication**

* JWT-based login & session management
* Password encryption using **bcrypt**
* Middleware for role-based access control

---

###  **Employee Management**

* Create Employee (Admin only)
* Auto-generated Employee IDs (`VY0001`)
* Update employee details
* Fetch profile of logged-in user
* Store employee contact and profile photo URL

---

###  **Attendance System**

* Mark today's attendance (Check-in / Check-out)
* Fetch today's attendance status
* Monthly attendance history
* Auto-detect:

  * Present
  * Absent
  * Late
  * Half-day (future scope)

---

###  **Compensation Module**

* Monthly salary calculation based on:

  * Basic Salary
  * HRA
  * Allowances
  * Working days
  * Leaves & deductions
* Auto-generated **payslip PDF** (via PDFKit)
* Payslip downloadable via API

---

###  **Profile Picture Upload (Cloudinary)**

* Upload employee profile picture from browser
* Uses Multer to extract file buffer
* Cloudinary stores images securely
* Returns Cloudinary URL for frontend display
* Updates MongoDB with the photo URL

---

#  Tech Stack (Backend)

* **Node.js**
* **Express.js**
* **MongoDB + Mongoose**
* **JWT Authentication**
* **Bcrypt Password Hashing**
* **Multer (file buffer)**
* **Cloudinary** (image hosting)
* **PDFKit** (payslip generation)
* **CORS**

---

#  Folder Structure

```
Backend/
│── config/
│   ├── cloudinary.js
│
│── controllers/
│   ├── addingEmployeeController.js
│   ├── attendance.js
│   ├── compensationController.js
│   ├── employeeProfile.js
│   ├── loginController.js
│   ├── registerController.js
│
│── middleware/
│   ├── Authentication.js
│   ├── uploadProfilePic.js
│
│── models/
│   ├── Employee.js
│   ├── Attendance.js
│   ├── User.js
│
│── routes/
│   ├── auth.js
│   ├── employee.js
│
│── index.js
│── package.json
│── .env
│── README.md
```

---

# ⚙️ Environment Variables (`.env`)

```


CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Make sure to **never commit your .env file** to GitHub.

---

# 🔗 API Routes

##  Authentication Routes ( `/auth` )

| Method | Route            | Description                 |
| ------ | ---------------- | --------------------------- |
| POST   | `/auth/register` | Register new employee login |
| POST   | `/auth/login`    | Login & generate JWT        |

---

##  Employee Routes ( `/employee` )

| Method | Route                     | Description                        |
| ------ | ------------------------- | ---------------------------------- |
| GET    | `/employee/profile`       | Get logged-in employee profile     |
| PUT    | `/employee/profile`       | Update profile contact + photo URL |
| POST   | `/employee/profile/photo` | Upload profile picture             |
| POST   | `/employee/create`        | Create employee (Admin)            |
| GET    | `/employee/all`           | Get all employees                  |
| GET    | `/employee/:employeeId`   | Get specific employee              |
| PUT    | `/employee/:employeeId`   | Update employee                    |

---

##  Attendance Routes

| Method | Route                             | Description             |
| ------ | --------------------------------- | ----------------------- |
| POST   | `/employee/attendance/mark-today` | Mark today's attendance |
| GET    | `/employee/attendance/status`     | Today's status          |
| GET    | `/employee/attendance/month`      | Monthly attendance      |

---

##  Compensation Routes

| Method | Route                                | Description      |
| ------ | ------------------------------------ | ---------------- |
| GET    | `/employee/compensation/month`       | Monthly salary   |
| GET    | `/employee/compensation/payslip/pdf` | Download payslip |

---

#  Installation & Setup

### 1️ Clone Repository

```
git clone <repo-url>
cd Backend
```

### 2️ Install Dependencies

```
npm install
```

### 3️ Setup `.env` file

Paste your MongoDB URL, Cloudinary credentials, and JWT secret.

### 4️ Start Server

```
npm start
```

Server runs by default at:
 `http://localhost:3000`

---

#  PDF Payslip Generation

Each salary month returns a downloadable PDF with:

* Employee Details
* Attendance Summary
* Salary Breakdown
* Net Pay
* Company Branding

---

#  Testing Tools

Use **Postman** or **ThunderClient** to test API endpoints.

---

#  Deployment

### **Backend Hosting: Render**

* Create new Web Service
* Set environment variables
* Auto deploy from GitHub
* Supports build & start commands

---

#  Future Enhancements

* Leave Request Management
* Admin dashboard analytics
* Real-time notifications using Socket.IO
* Email sending of payslip
* Multi-role system

---



