const mongoose = require ('mongoose');
const {CommentSchema, CommentModel}= require('./commentModel');

const PrincipalSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    startComment:{
        required: true,
        type:String
    },
    comments: [CommentSchema] 
});

const Principal = mongoose.model ('register', PrincipalSchema);

const PrincipalModel={
    createEntry: function(newEntry){
        return Principal.create(newEntry);
    },
    getEntries:function(){
        return Principal.find();
    },
    getEntrybyId: function (id){
        return Principal.findOne({_id: id})
    },
    updateEntryComment : function( id, newComment ){
        return CommentModel.addComment( newComment )
            .then( result => {
                return Principal.findByIdAndUpdate({_id: id}, {$push: {comments: result}});
            });
    }
};
module.exports = {PrincipalModel};