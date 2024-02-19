const jwt = require('jsonwebtoken');
// const userModel = require('../models/userModel');
const validator = require('validator');
const zxcvbn = require('zxcvbn');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Favorite = require('../models/Favorite');
const nodemailer = require('nodemailer');

async function enviarCorreo(datosCorreo) {
  // Configurar el transportador de correo electrónico
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'fernandojosecardenas20@gmail.com',
      pass: 'west eqqf rdun gejz'
    }
  });

  // Configurar los datos del correo electrónico
  const mailOptions = {
    from: 'fernandojosecardenas20@gmail.com',
    to: datosCorreo.destinatario,
    subject: datosCorreo.asunto,
    text: datosCorreo.contenido
  };

  try {
    // Enviar el correo electrónico
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado:', info.response);
    return info.response;
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    throw error;
  }
}
exports.getUserInfo = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userInfo = await User.findByPk(user_id);
    if (!userInfo) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json([userInfo]);
  } catch (error) {
    console.error("Error en getUserInfo:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {


    const { mail, password } = req.body;

    // Busca el usuario por su correo electrónico utilizando el método findOne
    const user = await User.findOne({
      where: {
        mail: mail
      }
    });
    if (!validator.isEmail(mail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token="";
    // Devuelve los datos del usuario encontrado
    //res.status(200).json({ user, token });
        // Comparar la contraseña proporcionada con la almacenada en la base de datos
    bcrypt.compare(password, user.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);
      console.log(token);
      res.status(200).json({ user, token });
    });

  } catch (error) {
    // Maneja cualquier error
    console.error("Error en getUserByEmail:", error);
    return res.status(500).json(error);
  }
};

exports.register = async (req, res) => {
  try {
    const { mail, password, name, city, country, age, street } = req.body;

    const datosCorreo = {
      destinatario: mail,
      asunto: 'Registro en euskoTraffic',
      contenido: `Gracias por registrarte ${name}`
    };
    const response = await enviarCorreo(datosCorreo);
    console.log('Correo enviado correctamente:', response);
    if (!validator.isEmail(mail)) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ error: passwordError });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      mail: mail,
      password: hashedPassword,
      name: name,
      city: city,
      country: country,
      age: age,
      street: street
    });    
    const token = generateToken(newUser);
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json( error );
    // Maneja cualquier error
    console.error("Error en createUser:", error);
  }
};

exports.getUserFav = async (req, res) => {
  try {
    const { user_id, fav_id, sourceId } = req.params;
    const userFav = await Favorite.findOne({
      where: {
        user_id: user_id,
        fav_id: fav_id,
        sourceId: sourceId
      }
    });
    res.status(200).json(userFav);
  } catch (error) {
    console.error("Error en getUserFav:", error);
    res.status(500).json( error );

  }
};

exports.getUserDbFav = async (req, res) => {
  try {
    const { user_id, type } = req.params;
    console.log(req.params);
    const results = await Favorite.findAll({
      where: {
        user_id: user_id,
        type: type
      }
    });
    res.status(200).json(results);

  } catch (error) {
    console.error("Error en getUserDbFav:", error);
    res.status(500).json( error );
  }
};

exports.uploadUserFav = async(req, res) => {
  try {
    const { user_id, type, fav_id, sourceId, page, name } = req.body;
    const result = await Favorite.create({
      user_id: user_id,
      type: type,
      fav_id: fav_id,
      sourceId: sourceId,
      page: page,
      name: name
    });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json( error );
  }
};

exports.deleteUserFav = async(req, res) => {
  try {
    const { user_id, type, fav_id, sourceId } = req.params;
    const deletedRows = await Favorite.destroy({
      where: {
        user_id: user_id,
        type: type,
        fav_id: fav_id,
        sourceId: sourceId
      }
    });
    res.status(200).json(deletedRows);
  } catch (error) {
    console.log(error);
    res.status(500).json( error );
  }
};

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