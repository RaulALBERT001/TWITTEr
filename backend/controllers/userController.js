import User from "../models/user.model.js";



export const getUserProfile = async (req,  res) =>{
    
    const {username}  = req.params;
    if(!username || typeof username !== "string"){
        return res.status(400).json({message: "invalid username :( "})
    }

    try {
        
        const user = await User.findOne({username}).select("-password")
        if(!user) return res.status(404).json({message:  "User not found"})

        res.status(200).json(user)

    }catch(error){

        console.log(`Error in getUserProfile Controller: ${error}`)
        res.status(500).json({error: error.message})
       
    }

}