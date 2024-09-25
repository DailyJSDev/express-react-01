function routerLogger(router) {
  return (req, res, next) => {
    console.log(`request has reached the logger ${router}`);
    next();
  };
}

export { routerLogger };
