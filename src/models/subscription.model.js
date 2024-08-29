import mongoose, {Schema} from "mongoose";

const subsciptionSchema = new Schema({
 
    subsctiber:{
        type: Schema.Types.ObjectId,  // one who is subxcribing
        ref: "User",
        required: true
    },
    channel:{
        type: Schema.Types.ObjectId,  // one to  channel 
        ref: "User",
        required: true
    }

},{timestamps})


export const subsciption = mongoose.model("ScubscritionSchema", subsciptionSchema)