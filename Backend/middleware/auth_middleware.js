exports.requireRole = (roles) => {
    return (req, res, next) => {
        console.log(req.session);
        if (!req.session || !req.session.userId) {
            return res.status(401).json({ message: "Not authenticated!" }); 
        }

        if (!roles.includes(req.session.role)) {
            return res.status(403).json({ message: "Access denied" }); 
        }

        next();
    };
};
