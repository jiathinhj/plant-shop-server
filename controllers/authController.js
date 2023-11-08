
const { authService } = require('../services/authService')
const { sendMail } = require('../configs/nodemailer/sendMail');
const { verifyEmailToken } = require('../configs/jwt/jwtGenerate');
const { jwtVerify } = require('../configs/jwt/jwtVerify')

const checkEmailDuplication = async (req, res) => {
    try {
        const { email } = req.query;
        const isDuplicated = await authService.checkEmailDuplication(email);

        if (isDuplicated) return res.status(400).send({ message: 'Email already exists' })

        return res.status(200).send({ message: 'Email valid' })
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }

}

const signUp = async (req, res) => {
    try {
        const signUpData = req.body;

        const { error } = await authService.signUp(signUpData);


        if (error) return res.status(error.statusCode).send({ message: error.message })

        const token = verifyEmailToken(signUpData)
        await sendMail(signUpData.email,
            'Plant shop verification email',
            `Hey you! Please click on this link to verify your account and start planting: ${process.env.SERVER}/auth/verifyEmail/${token}. The verification will expire in 10 minutes`)
        return res.send()
    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const { error, decoded } = jwtVerify(token, process.env.TOKEN_SECRET)

        if (error) return res.status(400).send({ message: 'Token validation failed' })
        const email = decoded.email
        const { error: err, result } = await authService.createAccount(email);
        if (err) return res.status(err.statusCode || 400).send({ message: err.message })

        return res.redirect(`${process.env.LOGIN_REDIRECT_ENDPOINT}`)

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}

module.exports.authController = {
    checkEmailDuplication,
    signUp,
    verifyEmail
}