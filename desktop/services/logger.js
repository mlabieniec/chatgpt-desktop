const env = process.env.NODE_ENV
const dev = (env === 'development')

Logger = {

    log(message, object = {}) {
        if (dev)
            return console.log(message, object)
    }

}

module.exports = {
    Logger
}