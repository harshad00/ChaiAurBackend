import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
  {
    videoFile: {
      type: "String", //cloudenary
      required: true,
    },
    thumbnail: {
      type: "String",
      required: true,
    },
    title: {
      type: "String",
      requerd: true,
    },
    description: {
      type: "String",
      requerd: true,
    },
    duration: {
      type: "Number",
      requerd: true,
    },
    views: {
      type: "Number",
      default: 0,
    },
    isPublished: {
      type: "Boolean",
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema);
