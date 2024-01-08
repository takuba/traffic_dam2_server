//var screen=require('../pantallaSeguridad.html')
var jwt = require('jsonwebtoken');
const path = require('path');
module.exports = function (req, res, next) {
        //console.log(req.headers.authorization);
       var checked=0;
       if(req.headers.authorization==undefined){
         //res.sendFile('pantallaSeguridad.html')
         res.sendFile(path.join(__dirname+'/pantallaSeguridad.html'));
       }else{
         //res.send("NO entro")
         const token = req.headers.authorization;

         if (!token) {
           return res.status(401).json({ error: 'Unauthorized: Token not provided' });
         }
       
         const secretKey = 'tu_clave_secreta'; // Cambia esto por la misma clave que usaste en userController.js
       
         try {
           const decoded = jwt.verify(token, secretKey);
           req.user = decoded.user;
           next();
         } catch (error) {
           return res.status(401).json({ error: 'Unauthorized: Invalid token' });
         }
       }

      };


        




