export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const roleAliases = {
      learner: "student",
      trainer: "faculty",
      student: "learner",
      faculty: "trainer",
    };
    const requestedRoles = new Set(roles);
    const currentRole = req.user?.role;

    if (!requestedRoles.has(currentRole) && !requestedRoles.has(roleAliases[currentRole])) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

// Alias for backward compatibility
export const roleMiddleware = authorizeRoles;

// Default export
export default authorizeRoles;
