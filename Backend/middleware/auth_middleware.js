exports.checkAdmin = (req, res, next) => {
    console.log("Middleware checkAdmin triggered"); 
    console.log("Session Data:", req.session);
    console.log("Session Role:", req.session.role); // Cek isi role sebelum pengecekan

    if (!req.session.role || req.session.role !== "Admin") {
        console.log("Authorization failed: Role is not Admin"); // Tambahkan logging
        return res.status(403).json({ message: "Unauthorized: Only Admin can perform this action" });
    }

    console.log("Authorization passed: User is Admin");
    next();
};
