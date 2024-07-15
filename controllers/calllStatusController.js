const callStatusModel = require("../models/callStatusModel");

exports.addCallStatus = async (req, res) => {
    try {
        // console.log(req.body.data,"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        let toInsert;
        if(Object.entries(req.files).length!==0)
        {
            toInsert=JSON.parse(req.body.data);
            for(let i in req.files)
              {
                toInsert[i]=req.files[i][0]?.location;
                // console.log(i);
              } 
        }else{
          toInsert=JSON.parse(req.body.data);
        }

        

        // console.log(toInsert);
        const callStatusData=new callStatusModel(toInsert);
        const result= await callStatusData.save();
        if(result)
        {
          return res.status(200).json({message:"data saved success",result});
        }
    } catch (error) {
    return res.status(500).json({message:"something went wrong",error:error.message})
    }
}