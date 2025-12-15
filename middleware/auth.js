// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  req.session.error_msg = 'Please log in to access this page';
  res.redirect('/auth/login');
};

// Middleware to check if user is admin
exports.isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.session.error_msg = 'Access denied. Admin only.';
  res.redirect('/');
};

// Middleware to check if user is approved student
exports.isApproved = (req, res, next) => {
  if (req.session.user && req.session.user.status === 'approved') {
    return next();
  }
  req.session.error_msg = 'Your account is pending approval';
  res.redirect('/');
};

// Middleware to check if user is guest (not logged in)
exports.isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};