const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const validator = require('validator');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');

function generateToken(user) {
  const secretKey = 'tu_clave_secreta'; // Cambia esto por una clave segura
  return jwt.sign({ user }, secretKey, { expiresIn: '1h' });
}

function validatePassword(password) {
  const result = zxcvbn(password);

  if (result.score < 3) {
    return 'La contraseña es débil, intenta una más fuerte';
  }

  return null; // La contraseña es válida
}

exports.register = (req, res) => {
  const { email, password } = req.body;

  // Validar si ese correo ya existe
  userModel.getUserByEmail(email, (error, user) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (user) {
      return res.status(409).json({ error: 'Ese correo ya existe' });
    }

    // Validar el correo electrónico antes de continuar
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: 'Correo electrónico no válido' });
    }

    // Validar la contraseña antes de continuar
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const newUser = {
      email: email,
      password: password,
    };

    userModel.createUser(newUser, (error, results) => {
      // console.log(results);
      if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      const token = generateToken(newUser);
      res.json({ user: newUser, token });
    });
  });
};


exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.getUserByEmail(email, (error, user) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  //console.log(user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);
      console.log(token);
      res.json({ user, token });
    });
  });
};
