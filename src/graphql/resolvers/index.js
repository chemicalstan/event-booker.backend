const Event = require("../../models/Event");
const User = require("../../models/User");

const formatDate = date => new Date(date).toISOString();
const user = async id => {
  try {
    const user = await User.findById(id);
    return {
      ...user._doc,
      _id: user.id,
      date: formatDate(user._doc.date),
      password: null,
      createdEvents: event.bind(this, user._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};
const event = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: formatDate(event._doc.date),
        creator: user.bind(this, event._doc.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: formatDate(event._doc.date),
          creator: user.bind(this, event._doc.creator)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  users: async () => {
    try {
      const users = await User.find();
      return users.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          date: formatDate(user._doc.date),
          password: null,
          createdEvents: event.bind(this, user._doc.createdEvents)
        };
      });
    } catch (err) {
      throw err;
    }
  },
  user: async args => {
    try {
      const { _id } = args;
      const user = await User.find({ _id });
      return user;
    } catch (err) {
      throw err;
    }
  },
  createEvent: async args => {
    try {
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
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        _id: result.id,
        creator: user.bind(this, result._doc.creator)
      };
      const user = await User.findById("613386ffd5a87e1938ab66a6");
      if (!user) {
        throw new Error("User doesn't exist!");
      }
      await user.createdEvents.push(createdEvent);
      await user.save();
      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
  createUser: async args => {
    try {
      const { name, email, password } = args.userInput;
      // check if user already exist
      const userExit = await User.findOne({ email });
      if (userExit) {
        throw new Error("User already exists!");
      }
      const user = new User({
        name,
        email,
        password,
        date: new Date()
      });
      const result = await user.save();
      return { ...result._doc, _id: result.id, password: null };
    } catch (error) {
      throw error;
    }
  }
};
