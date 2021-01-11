module.exports = {
    response: (res, message, aditionalData, success = true, status = 200) => {
      res.status(status).send({
        success,
        message: message || 'Success',
        ...aditionalData
      })
    }
  }