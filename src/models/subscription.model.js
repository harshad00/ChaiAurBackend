import mongoose, {Schema} from "mongoose";

const subscriptionSchema = new Schema({
 
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


export const subsciption = mongoose.model("Subscrition", subscriptionSchema)