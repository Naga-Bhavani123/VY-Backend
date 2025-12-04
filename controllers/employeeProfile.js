import Employee from "../models/Employee.js";
import cloudinary from "../config/cloudinary.js";  
import dotenv from "dotenv"
dotenv.config()

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const employeeId = req.user.employeeId;
    console.log(req.file.buffer)

    console.log("Cloudinary loaded:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING"
});

    // Upload buffer → cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "vy_profile_photos",
          resource_type: "image",
        },
        (error, result) => {
          console.log(error)
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    console.log(updatingProfile)

    const photoUrl = uploadResult.secure_url; // <-- REAL URL
    await Employee.findOneAndUpdate(
      { employeeId },
      { profilePhotoUrl: photoUrl }
    );

    return res.json({
      msg: "Photo uploaded successfully",
      profilePhotoUrl: photoUrl,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Upload failed", error: err.message });
  }
};


export const updatingProfile = async (req, res) => {
  try{
    const {employeeId} = req.user; 
    console.log(employeeId);
    const {contactNumber, profilePhotoUrl} = req.body; 

    const respons = await Employee.findOneAndUpdate({employeeId}, {contactNumber, profilePhotoUrl}); 
    
    res.send({msg: "Profile updated successfully"})


  }catch(error){
    console.log(error)
  }
}


