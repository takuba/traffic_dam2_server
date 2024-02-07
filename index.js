const express = require('express');
const app = express();
const router = require ('./routes/routes')

//Port config
const PORT = process.env.PORT || 3000;
app.use (express.urlencoded({ extended: false}));
app.use (express.json());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
app.use(router);
// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
