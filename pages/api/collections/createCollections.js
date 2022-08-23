import connectDB from "../../../utils/connectDB";
import Collections from "../../../models/collectionsModel"

connectDB();

const createCollection = async (req, res) => {
    if (req.method == 'POST') {
      console.log(req.body);
      try{
        let newCollection = await Collections.create(req.body);
        if (newCollection) {
            console.log(newCollection);
            res.status(201).json({
                success:true,
                message: "Succesful creation of Collection",
                body: newCollection
            });
        } else {
            res.status(400).json({
                success: false
            })
        }
      }catch(error){
        res.status(400).json({
            success:false,
            message : "Error Occured"
        })
        console.log(error)
      }
    }    
    else{
      res.status(404).json({
          success:false,
          message : "No such end point exist (Yet)"
      })
    }
}
export default createCollection;