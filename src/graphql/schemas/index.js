const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        user: User!
        event: Event!
        createdAt: String!
        updatedAt: String!
    }

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
        booking: [Booking!]!
    }
    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
