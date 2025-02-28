import User from "../models/user.model.js";
import Notification from "../models/notifiaction.model.js";



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

export const followUnfollowUser = async (req, res) => {

    try {
        const { id } = req.params;
        
        const UserToFollowId = id
        const currentUserId = req.user._id
    
        const userToFollow = await User.findById(UserToFollowId)
        const currentUser = await User.findById(currentUserId)
        

        if ( !userToFollow || !currentUser ) { return  res.status(404).json("user(s) not found :(")}
               
        if ( UserToFollowId === currentUserId.toString() ) {return res.status(400).json("cant follow yourself :)")}

        const isFollowing = currentUser.following.includes(UserToFollowId);

        //start a transaction
        const session = await User.startSession();//used To assure atomicity on the Database
        session.startTransaction();

        try {
            if (isFollowing) {
                await User.findByIdAndUpdate(UserToFollowId, { $pull: { followers: currentUserId } }, { session });
                await User.findByIdAndUpdate(currentUserId, { $pull: { following: UserToFollowId } }, { session });
            } else {
                await User.findByIdAndUpdate(UserToFollowId, { $push: { followers: currentUserId } }, { session });
                await User.findByIdAndUpdate(currentUserId, { $push: { following: UserToFollowId } }, { session });

                const newNotification =  new Notification({
                    type: "follow",
                    from: currentUserId,
                    to: UserToFollowId, 
                })

                await newNotification.save({session})
                //TODO: return the id of the user as a response
            }

            await session.commitTransaction();
            session.endSession();

            return res.status(200).json({
                message: isFollowing ? "Unfollowed successfully!" : "Followed successfully!"
            });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
        //end a transaction



    } catch (error) {
        return res.status(500).json({error: error.message})
    }


}

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id
        const usersFollowedByMe = await User.findById(userId).select("followers")


        const users = await User.aggregate([
            { $match: { _id: { $ne: userId } } },
            { $sample: { size: 5 } },
        ])

        Filtered = users.filter(user => usersFollowedByMe.following.includes.includes )


        



    } catch (error) {
        
    }
}