var jwt = require('jsonwebtoken');
exports.RecoveryExpiredAccessToken = (req, res) => {

    //console.log("ENTROOO");
    const tokenRecivedRecover=req.body.RefreshRecoveryToken;
    //console.log(tokenRecivedRecover);

    const tokenRecived = jwt.verify(tokenRecivedRecover, 'shhhhh');
   // console.log("desencrip: "+tokenRecived.foo);
    if(tokenRecived.foo==process.env.Refresh_Token)
    {
       // console.log("entro al condicional");
        var AccessToken=jwt.sign({
            data: process.env.Access_Token
          }, 'shhhhh', { expiresIn: 1 * 3600 });
        var RefreshToken = jwt.sign({ foo: process.env.Refresh_Token }, 'shhhhh');
        const BothToken={
            Access:AccessToken,
            Refresh:RefreshToken
        }
         res.send(BothToken)
    }
        //console.log(decoded.foo);

};
