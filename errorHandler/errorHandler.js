const errorHandler = (error) => {
    console.log(error)
    return {
        error:
        {
            statusCode: 400,
            message: error.message
        },
        result: undefined
    }
}
module.exports = { errorHandler }