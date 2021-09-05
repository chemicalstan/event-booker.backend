const Event = require("../../models/Event");
const User = require("../../models/User");

const formatDate = date=> new Date(date).toISOString();
const user = id => {
    return User.findById(id)
      .then(user => {
        return {
          ...user._doc,
          _id: user.id,
          date: formatDate(user._doc.date),
          password: null,
          createdEvents: event.bind(this, user._doc.createdEvents)
        };
      })
      .catch(err => {
        throw err;
      });
  };
  const event = ids => {
    return Event.find({ _id: { $in: ids } })
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            _id: event.id,
            date: formatDate(event._doc.date),
            creator: user.bind(this, event._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  };

  module.exports = {
    events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              return {
                ...event._doc,
                _id: event.id,
                date: formatDate(event._doc.date),
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
              return {
                ...user._doc,
                _id: user.id,
                date: formatDate(user._doc.date),
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
            createdEvent = { ...result._doc, _id:result.id, creator: user.bind(this, result._doc.creator) };
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
  }