import Mongoose from "mongoose";

const reviewShema = new Mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
      maxlength: 100,
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Please add a rating between 1 and 10"],
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
reviewShema.index({ bootcamp: 1, user: 1 }, { unique: true });
// reviewShema.statics.getRate = async function (bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: {
//         bootcamp: bootcampId,
//       },
//     },
//     {
//       $group: {
//         _id: "$bootcamp",
//         averageRating: { $avg: "$rating" },
//       },
//     },
//   ]);
//   try {
//     await this.model("Bootcamps").findByIdAndUpdate(bootcampId, {
//       averageRating: Math.ceil(aggregate[0].averageCost * 10) / 10,
//     });
//   } catch (error) {
//     console.log(error);
//     throw new Error(error);
//   }
// };
// reviewShema.post("save", function (doc) {
//   this.constructor.getRate(doc.bootcamp);
// });
// reviewShema.pre("remove", function () {
//   this.constructor.getRate(this.bootcamp);
// });
const review = Mongoose.model("Review", reviewShema);

export default review;
