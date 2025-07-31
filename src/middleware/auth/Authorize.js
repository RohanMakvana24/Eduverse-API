const authorizeRole = (...roles) => {
  if (!roles || roles.length === 0) {
    throw new Error("No roles provided for authorization");
  }
  return (req, res, next) => {
    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: No role found for user",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized`,
      });
    }
    next();
  };
};

export default authorizeRole;
