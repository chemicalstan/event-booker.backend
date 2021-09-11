const mongoose = require("../db/mongoConfig");
const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event"
    }
  },
  { timestamps: true }
 );

module.exports = mongoose.model("Booking", bookingSchema);
