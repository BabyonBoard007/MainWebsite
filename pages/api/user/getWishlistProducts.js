import connectDB from "../../../utils/connectDB";
import { getSession } from "next-auth/react"
import User from '../../../models/userModel';
import Products from '../../../models/productModel'

connectDB();

const getWishlistProducts = async (req, res) => {
    if (req.method == 'GET') {
        const session = await getSession({ req });
        if(session){    //user is logged in
            try{
                let f_user = await User.findOne({email: session.user.email});
                if(f_user){
                    let product_ids = f_user.wishlist;
                    let wishlistProducts=[];
                    for(let id of product_ids){
                        let product = await Products.findById(id._id);
                        wishlistProducts.push(product);
                    }
                    // console.log('############',wishlistProducts);
                    res.status(201).json({
                        success:true,
                        message: "Wishlist products",
                        body: wishlistProducts
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
export default getWishlistProducts;