import connectDB from "../../../utils/connectDB";
import Collections from "../../../models/collectionsModel"
import { stringify } from "postcss";

connectDB();

const deleteCollection = async (req,res)=>{
    console.log('here is delete api log ',typeof(req.body.name))
    if(req.method == "DELETE"){
        try{
            let f_col = await Collections.findOne({name: req.body.name});
            if(f_col && (f_col.categories.length == 0) ){
                f_col = await Collections.findOneAndDelete({name: req.body.name});
                res.status(200).json({
                    success:true,
                    message : "Collection has been deleted",
                    body: f_col
                })
            }
            else{
                res.status(400).json({
                    success:false,
                    message : "Couldn't delete the collection"
                })
                console.error("error occured :", error);
            }
        }catch(error){
            res.status(400).json({
                success:false,
                message : "Error Occured"
            })
            console.error("error occured :", error);
        }
    }
    else{
        res.status(404).json({
            success:false,
            message : "No such end point exist (Yet)"
        })
    }
}
export default deleteCollection;