const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const low = require("lowdb");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

//Default port
const PORT = process.env.PORT || 4000;

//Store Data in Files
const FileSync = require("lowdb/adapters/FileSync");

//Initialize DB and Adapter
const adapter = new FileSync("db.json");
const db = low(adapter);

//Default data for Storage
db.defaults({ books: [] }).write();

//Option Object for Swagger
const option = {
  definition: {
    openapi: "3.0.0",
    //Project Info
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A Simple Express Library API",
    },
    //Server for api-docs
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

//Initialize SwaggerJsDoc
const specs = swaggerJsDoc(option);

//Initialize Express
const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//Access db in routes
app.db = db;

//Initialize Cors
app.use(cors());

//Initialize Body Parser
app.use(express.json());

//Initialize Morgan
app.use(morgan("dev"));

//Initialize Routes
app.use("/books", require("./routes/books"));

//Launching Server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
