module.exports = function CustomError(err,res) {

console.log(err);
  switch (err.name) {
      case 'ValidationError':
       var modelState = [];
          for (field in err.errors) {
              modelState.push(err.errors[field].message);
          }
         return res.status(500).send({message: err.message, modelState:modelState});
      default:
          var errorStatus = err.status || 500;
          return res.status(errorStatus).send(errorStatus, {message: err.message});
  }
};
