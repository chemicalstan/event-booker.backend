require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const app = express();
const graphQlResolvers =require("./graphql/resolvers/index")
const graphQlSchemas =require("./graphql/schemas/index")
app.use(bodyParser.json());



let schema = 
app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchemas,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

app.listen(3001, () => {
  console.log("server running at port 3001");
});
