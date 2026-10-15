import jwt from 'jsonwebtoken';

// Verifies the "Authorization: Bearer <token>" header issued at login and
// exposes the authenticated user's id as req.userId.
export const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Please log in to continue' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please log in again.' });
  }
};
