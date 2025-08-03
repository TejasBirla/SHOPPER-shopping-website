import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

export default generateToken;
