const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const dropbox = require('../configs/dropbox/dropbox')
const fs = require('fs')

const { errorHandler } = require('../errorHandler/errorHandler')

const prisma = new PrismaClient();

const checkEmailDuplication = async (email) => {
    try {
        await prisma.$connect();
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if (user) return true; //user already exists
        return false; // not duplicate
    } catch (error) {
        return errorHandler(error)
    } finally {
        prisma.$disconnect();
    }
}

const signUp = async (signUpData) => {
    try {
        let error;
        console.log(signUpData)
        await prisma.$connect();
        signUpData.hashedPassword = await bcrypt.hash(signUpData.password, Math.floor(Math.random() * 10))
        delete signUpData.password;

        //check if user already exists
        const user = await prisma.user.findUnique({
            where: { email: signUpData.email }
        })

        //user already exists
        if (user) return {
            error: {
                statusCode: 400,
                message: 'Account already exists'
            },
            result: undefined
        }

        const pendingAccount = await prisma.pendingAccount.findUnique({
            where: {
                email: signUpData.email
            }
        })

        //user already sign up but not verified via email yet
        if (pendingAccount) return { error, result: pendingAccount }

        //create a new signup record
        const newAccount = await prisma.pendingAccount.create({
            data: signUpData
        })
        return { error, result: newAccount }
    } catch (error) {
        return errorHandler(error)
    } finally {
        prisma.$disconnect()
    }
}

const createAccount = async (email) => {
    try {
        await prisma.$connect();
        const pendingAccount = await prisma.pendingAccount.findUnique({
            where: { email: email }
        })

        //set default avt and save to dropbox
        const pictureBuffer = fs.readFileSync(global.__path_default_avatar)
        const { pictureId, pictureUrl } = await dropbox.uploadImage(pictureBuffer)
        pendingAccount.pictureId = pictureId
        pendingAccount.pictureUrl = pictureUrl

        //create new account and delete from pending account table
        await Promise.all([
            prisma.user.create({
                data: pendingAccount
            }),
            prisma.pendingAccount.delete({
                where: { email: email }
            })
        ])
        return {
            error: undefined,
            result: pendingAccount
        }

    } catch (error) {
        return errorHandler(error)
    } finally {
        prisma.$disconnect
    }
}

module.exports.authService = {
    checkEmailDuplication,
    signUp,
    createAccount,
}