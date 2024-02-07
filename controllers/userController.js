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
    return 'The password is weak, try a stronger one';
  }

  return null; // La contraseña es válida
}

exports.register = (req, res) => {
  const { mail, password, name, city, country, age, street } = req.body;

  // Validar si ese correo ya existe
  userModel.getUserByEmail(mail, (error, user) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (user) {
      return res.status(409).json({ error: 'That email already exists' });
    }

    // Validar el correo electrónico antes de continuar
    if (!validator.isEmail(mail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Validar la contraseña antes de continuar
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }

    const newUser = {
      mail: mail,
      password: password,
      name: name,
      city: city,
      country: country,
      age: age,
      street: street

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
  const { mail, password } = req.body;

  userModel.getUserByEmail(mail, (error, user) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!validator.isEmail(mail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(mail);
    // Validar el correo electrónico antes de continuar

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);
      console.log(token);
      res.status(200).json({ user, token });
    });
  });
};

exports.getUserFav = (req, res) => {
  userModel.getUserFav(req.params, (error, results) => {
     console.log(results);
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    //console.log(results);
    res.json(results );
  });
};

exports.getUserDbFav = (req, res) => {
  userModel.getUserDbFav(req.params, (error, results) => {
     console.log(results);
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    //console.log(results);
    res.json(results );
  });
};

exports.getUserInfo = (req, res) => {
  userModel.getUserInfo(req.params, (error, results) => {
     console.log(results);
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    //console.log(results);
    res.json(results );
  });
};

exports.uploadUserFav = (req, res) => {
  const { user_id, type, fav_id, sourceId, page, name } = req.body;
  userModel.uploadUserFav(req.body, (error, results) => {
    // console.log(results);
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ user: user_id, type, fav_id, sourceId, page, name });
  });
};

exports.deleteUserFav = (req, res) => {
  const { user_id, type, fav_id, sourceId } = req.params;
  userModel.deletedUserFav(req.params, (error, results) => {
    // console.log(results);
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json({ user: user_id, type, fav_id, sourceId });
  });
};
