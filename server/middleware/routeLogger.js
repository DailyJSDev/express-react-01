function routeLogger(req, res, next) {
  console.log(`request arrived at ${req.url} handler`);
  next();
}

export default routeLogger;
