import jwt from "jsonwebtoken";

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    
    const payload = jwt.verify(token, "Secret_Key");

    
    req.user = payload; 
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authentication;
