/**@type {Mongoose.SchemaOptions} */
import Mongoose from "mongoose";
import validator from "validator";
import slugify from "slugify";
import geocoder from "../utils/geocoder.js";
const bootcampsShcema = Mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please add description"],
      trim: true,
      maxlength: [500, "description can not be more than 50 characters"],
    },
    website: {
      type: String,
      validate: {
        validator: function (value) {
          return validator.isURL(value);
        },
        message: (props) => `${props.value} is not a valid WEB URL!`,
      },
    },
    phone: {
      type: String,
      //   validate: {
      //     validator: function (value) {
      //       return validator.isMobilePhone(value, "any");
      //     },
      //     message: (props) => `${props.value} is not a valid Phone number!`,
      //   },
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Please add Email"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid Email!`,
      },
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String,
    },
    careers: {
      type: [String],
      required: true,
      enum: [
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Data Science",
        "Business",
        "Other",
      ],
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating must can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true, toObject: { virtuals: true } } }
);
bootcampsShcema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
bootcampsShcema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
  };
  this.address = undefined;
  next();
});
bootcampsShcema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});
bootcampsShcema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});
const bootcamps = Mongoose.model("Bootcamps", bootcampsShcema);

export default bootcamps;
