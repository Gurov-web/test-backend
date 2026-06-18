const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ msg: 'Доступ разрешён только администраторам' });
};

module.exports = adminOnly;