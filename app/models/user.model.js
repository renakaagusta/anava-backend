const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: {
      type: String,
      default: "first",
    },
    lastname: {
      type: String,
      default: "last",
    },
    image: {
      type: String,
      default: "avatar.jpg",
    },
    verification: {
      type: Number,
      default: 0,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    admin: {
      division: {
        type: String,
        default: "",
      },
    },
    participant: {
      location: {
        subdistrict: {
          type: String,
          default: "",
        },
        city: {
          type: String,
          default: "",
        },
        province: {
          type: String,
          default: "",
        },
      },
      school: {
        name: {
          type: String,
          default: "SMA",
        },
        address: {
          type: String,
          default: "SMA",
        },
      },
      document: {
        image: {
          status: Number,
          default: 0,
        },
        osis_card: {
          status: Number,
          default: 0,
        },
      },
      events: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
          },
          name: {
            type: String,
            default: "",
          },
          stages: [
            {
              id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stage",
              },
              name: {
                type: String,
                default: "",
              },
              session: {
                type: String,
                default: "",
              },
              created_at: {
                type: Date,
                default: Date.now(),
              },
              updated_at: {
                type: Date,
                default: Date.now(),
              },
            },
          ],
          created_at: {
            type: Date,
            default: Date.now(),
          },
          updated_at: {
            type: Date,
            default: Date.now(),
          },
        },
      ],
      certificate: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Certificate",
        },
      ],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    updated_at: {
      type: Date,
      default: Date.now(),
    },
  })
);

module.exports = User;
