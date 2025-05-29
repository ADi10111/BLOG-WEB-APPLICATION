const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    content: {
        type:String,
        required: true,
    },
    //ON which blog comment is done
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "blog",
    },
    //Who commented
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
},
 {timestapms: true}
);

const Comment = model("comment", commentSchema);

module.exports = Comment;