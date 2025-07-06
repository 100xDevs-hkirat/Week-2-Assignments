const { verify } = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET =
  "gsPAhGCA@PWNX@wfyzDraz!4E!L_KDFgQY6kRbzRj3y@*YhRKgPDo6Grwpud";

const jwtAuth = (req, res, next) => {
  const authorization = req.headers["authorization"];
  if (!authorization)
    return res.status(400).send("Authorization header not found.");

  const token = authorization.split(" ")[1];
  let id;
  try {
    id = verify(token, ACCESS_TOKEN_SECRET).id;
  } catch (err) {
    return res.status(400).send("Token is invalid");
  }
  if (!id) return res.status(400).send("Unable to verify token");
  req.id = id;
  next();
};

const myAuthenticate = (req, res, next) => {
  if (!(req.headers.username && req.headers.password))
    return res.status(401).send("Unauthorized");

  req.username = req.headers.username;
  req.password = req.headers.password;

  next();
};

const authenticate = (req, res, next) => {
  if (!(req.headers.email && req.headers.password))
    return res.status(401).send("Unauthorized");

  req.email = req.headers.email;
  req.password = req.headers.password;

  next();
};

// module.exports = { protected };

exports.jwtAuth = jwtAuth;
exports.authenticate = authenticate;
exports.myAuthenticate = myAuthenticate;
