import connectDB from "../../../utils/connectDB";
import { getSession } from "next-auth/react"
import User from '../../../models/userModel';

connectDB();

const addToWishlist = async (req, res) => {
    console.log(typeof(req.body));
    // const data = JSON.parse(req.body)
    const data = req.body;
    if (req.method == 'POST') {
        const session = await getSession({ req });
        if(session){    //user is logged in
            try{
                let f_user = await User.findOne({email: session.user.email});
                if(f_user){ 
                    f_user.wishlist.push(data.id);
                    await f_user.save();
                    res.status(201).json({
                        success:true,
                        message: "item added to user's wishlist"
                    })
                }
                else{
                    res.status(400).json({
                        success: false,
                        message: "user couldn't be found",
                    })
                }
            }
            catch(error){
                console.error("error in finding user: ", error);
                res.status(400).json({
                    success:false,
                    message : "Error Occured"
                })
            }
        }
        else{   //no user logged in
            res.status(403).json({
                success: false,
                message: "There is no logged in user"
            })
        }
    }else{
        res.status(404).json({
            success:false,
            message : "No such end point exist (Yet)"
        })
    }
}
export default addToWishlist;