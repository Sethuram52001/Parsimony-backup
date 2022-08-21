const jwt = require('jsonwebtoken');

exports.auth = (req, res, next) => {
  const token = JSON.parse(req.header('x-auth-token'));

  if (!token) {
    return res
      .status(401)
      .json({ isError: true, message: 'No token, authorization denied' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res
          .status(401)
          .json({ isError: true, message: 'Invalid token' });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ isError: true, error });
  }
};
