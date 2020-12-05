const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    firstname: {
      type: String,
      default: "",
    },
    lastname: {
      type: String,
      default: "",
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
      grade: {
        type: Number,
        default: 10,
      },
      birth_date: {
        type: Date,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      phone_number: {
        type: String,
        default: "",
      },
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
      region: {
        type: Number,
        default: 1,
      },
      school: {
        name: {
          type: String,
          default: "",
        },
        address: {
          type: String,
          default: "",
        },
      },
      document: {
        image: {
          type: Number,
          default: 0,
        },
        osis_card: {
          type: Number,
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
          number: {
            type: String,
            default: "",
          },
          paymentStatus: {
            type: Number,
            default: 0,
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
          pay_at: {
            type: Date,
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
