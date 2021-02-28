const indexRouter = require("./index");
const userRouter = require("./users");
const toyRouter = require("./toys");

exports.corsAccessControl = (app) => {
    app.all('*', (req, res, next) => {
      if (!req.get('Origin')) return next();
      res.set('Access-Control-Allow-Origin', '*');
      res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
      res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
      next();
    });
  }

exports.routesInit = (app) => {
    app.use("/", indexRouter);
    app.use("/users", userRouter);
    app.use("/toys", toyRouter);
  
    app.use((req,res) => {
      res.status(404).json({msg:"404 page not found"})
    })
  }