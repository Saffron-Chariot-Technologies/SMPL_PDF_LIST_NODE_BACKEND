exports.getCallStatusDataByDate = async (req, res) => {
    try {
      // console.log(req.query.status);
      // console.log(req.query.date);
      const type = req.query.type; // daily or monthly
      let date = req.query.date;
      date = new Date(date); // convert string format of date into object. since date object cannot comes  in query ,being converted to string , nd date object is not convertabl in string
      const toReturn = await callStatusModel.findOne({ type: type, date: date });
      if (!toReturn) {
        return res.status(200).json({ message: "data not found for ths date and type" });
      }
      return res.status(200).json({ message: "data found success", data: toReturn });
  
    } catch (error) {
      return res.status(500).json({ message: "something went wrong", error: error.message });
    }
  }