import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    FullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    age: {
        type: Number,
        required: true,
        min: 18,
    },
    password: {
        type: String,
        required: true,
    },
    isActive:{
        type: Boolean,
        default: true
    },

    followers:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    }
    ],
    following:[
        { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
    },
    ],
    
    profilePicture:{
        type: String,
        default: ""
    },

    coverImg:{
        type: String,
        default: ""
    },

    bio:{  
        type: String,
        default: ""
    },

    link:{
        type: String,
        default: ""
    },


    
   
    



}, {timestamps: true})


const User = mongoose.model("User", userSchema)
export default User