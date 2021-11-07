const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
export default asyncHandler;

// function runAsyncWrapper (callback) {
//     return function (req, res, next) {
//       callback(req, res, next)
//         .catch(next)
//     }
//   }

//   app.post('/signup', runAsyncWrapper(async(req, res) => {
//       await firstThing()
//       await secondThing()
//   })
