const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    image: String,
    password: String,
    email_confirmation: {
      type: Number, 
      default: 0,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    admin: {
      division: {
        type: String,
        default: '',
      }
    },
    participant: {
      location: {
        subdistrict: {
          type: String,
          default: '',
        },
        city: {
          type: String,
          default: '',
        },
        province: {
          type: String,
          default: '',
        }
      },
      school: {
        type: String,
        default: ''
      },
      document : {
        image: {
          status: Number,
          default: 0,
        },
        osis_card: {
          status: Number,
          default: 0,
        },
      },
      event: [{
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stage"
        },
        name: {
          type: String,
          default: ''
        },
        stages: [
          {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Stage"
            },
            name: {
              type: String,
              default: ''
            },
            poin: {
              type: Number,
              default: 0,
            },
            score: {
              type: Number,
              default: 0,
            },
            created_at: {
              type: Date,
              default: Date.now()
            },
            updated_at: {
              type: Date,
              default: Date.now()
            }
          }
        ],
        created_at: {
          type: Date,
          default: Date.now()
        },
        updated_at: {
          type: Date,
          default: Date.now()
        }
      }],
      certificate: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certificate",
      }]
    },
    created_at: {
      type: Date,
      default: Date.now()
    },
    updated_at: {
      type: Date,
      default: Date.now()
    },
  })
);

module.exports = User;
