const jwt = require("jsonwebtoken");

const DUMMY_USERS = [
  {
    username: process.env.DUMMY_USER_1_USERNAME,
    password: process.env.DUMMY_USER_1_PASSWORD,
  },
  {
    username: process.env.DUMMY_USER_2_USERNAME,
    password: process.env.DUMMY_USER_2_PASSWORD,
  },
];

// POST /auth/token
const generateToken = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "username and password are required" });
  }

  const user = DUMMY_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid credentials" });
  }

  const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
    expiresIn: "20m",
  });

  return res.json({ success: true, token, expiresIn: "10 minutes" });
};

module.exports = { generateToken };
