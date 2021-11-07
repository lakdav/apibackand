import Mongoose from "mongoose";

const courseShema = new Mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      required: [true, "Please add a number of weeks"],
    },
    tuition: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    minimumSkill: {
      type: String,
      required: [true, "Please add a minimum skil"],
      enum: ["beginner", "intermediate", "advanced"],
    },
    scholaedhipAvailble: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: Mongoose.Schema.ObjectId,
      ref: "Bootcamps",
      required: true,
    },
    user: {
      type: Mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// courseShema.statics.getAvargeCost = async function (bootcampId) {
//   try {
//     const aggregate = await this.aggregate([
//       { $match: { bootcamp: bootcampId } },
//       {
//         $group: {
//           _id: "$bootcamp",
//           averageCost: { $avg: "$tuition" },
//         },
//       },
//     ]);
//     console.log(aggregate);
//     await this.model("Bootcamps").findByIdAndUpdate(bootcampId, {
//       averageCost: Math.ceil(aggregate[0].averageCost * 10) / 10,
//     });
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };

// courseShema.post("save", function (doc) {
//   this.constructor.getAvargeCost(doc.bootcamp);
// });
// courseShema.pre("remove", function () {
//   this.constructor.getAvargeCost(this.bootcamp);
// });
const course = Mongoose.model("Course", courseShema);

export default course;
