exports.checkAdmin = (req, res, next) => {
    console.log("Middleware checkAdmin triggered"); 
    console.log("Session Data:", req.session);
    console.log("Session Role:", req.session.role);

    if (!req.session.role || !["Admin", "Super Admin"].includes(req.session.role)) {
        console.log("Authorization failed: Role is not Admin or Super Admin"); 
        return res.status(403).json({ message: "Unauthorized: Only Admin or Super Admin can perform this action" });
    }

    console.log("Authorization passed: User is Admin or Super Admin");
    next();
};


