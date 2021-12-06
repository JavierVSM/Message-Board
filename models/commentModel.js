const mongoose = require ('mongoose');

const CommentSchema = new mongoose.Schema({
    commentName:{
        type:String,
        required: true,
    },
    commentContent: {
        type:String,
        required: true,
    },
});

const Comment = mongoose.model('comments', CommentSchema);

const CommentModel = {
    addComment : function( newComment ){
        return Comment.create( newComment );
    }
}

module.exports={
    CommentSchema,
    CommentModel
};