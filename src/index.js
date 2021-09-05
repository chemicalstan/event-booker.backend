require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const graphql = require("graphql");
const { buildSchema } = graphql;
const { graphqlHTTP } = require("express-graphql");

const app = express();
const Event = require("./models/Event");
const User = require("./models/User");
app.use(bodyParser.json());

const user = id => {
  return User.findById(id)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        password: null,
        createdEvents: event.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};
const event = ids => {
  console.log("hahahah")
  return Event.find({ _id: { $in: ids } })
    .then(events => {
      console.log(events)
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          creator: user.bind(this, event._doc.creator)
        };
      });
    })
    .catch(err => {
      throw err;
    });
};

let schema = buildSchema(`

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
}
input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}
type User {
  _id: ID!
  name: String!
  email: String!
  password: String
  date: String!
  createdEvents: [Event!]
}

input UserInput {
  name: String!
  email: String!
  password: String!
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    user(_id: ID!): User!
}
type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return {
                ...event._doc,
                _id: event.id,
                creator: user.bind(this, event._doc.creator)
              };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      users: () => {
        return User.find()
          .then(users => {
            return users.map(user => {
              // console.log(user._doc.createdEvents)
              return {
                ...user._doc,
                _id: user.id,
                password: null,
                createdEvents: event.bind(this, user._doc.createdEvents)
              };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      user: args => {
        const { _id } = args;
        return User.find({ _id })
          .then(user => {
            return user;
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        const {
          eventInput: { title, description, price, date }
        } = args;
        const event = new Event({
          title,
          description,
          price: +price,
          date: new Date(),
          creator: "613386ffd5a87e1938ab66a6"
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc };
            return User.findById("613386ffd5a87e1938ab66a6");
          })
          .then(user => {
            if (!user) {
              throw new Error("User doesn't exist!");
            }
            user.createdEvents.push(createdEvent);
            return user.save();
          })
          .then(res => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
          });
      },
      createUser: args => {
        const { name, email, password } = args.userInput;
        // check if user already exist
        return User.findOne({ email })
          .then(result => {
            if (result) {
              throw new Error("User already exists!");
            }
            const user = new User({
              name,
              email,
              password,
              date: new Date()
            });
            return user.save();
          })
          .then(result => {
            delete result._doc.password;
            return { ...result._doc };
          })
          .catch(err => {
            throw err;
          });
      }
    },
    graphiql: true
  })
);

app.listen(3001, () => {
  console.log("server running at port 3001");
});
