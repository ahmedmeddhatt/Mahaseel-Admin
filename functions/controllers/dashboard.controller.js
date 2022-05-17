
const Request = require('../models/request.model');
const User = require('../models/user.model');


const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());


exports.Counters = async (req, res) => {
   try {
    const users = await User.countDocuments({});
    const requests = await Request.countDocuments({});
    const requestsToday = await Request.countDocuments({createdAt: {$gte: today}});
    const farms = await Request.countDocuments({status: 'accept' , certificate : {$ne : null}});

    res.json({
        "users" : users,
        "requestsToday" : requestsToday,
        "requests" : requests,
        "farms" : farms
    })
   } catch(error){
    res.status(500).json({
        "error" : 200
    })
   }
   
};

exports.Charts = async (req, res) =>  {
     try {
         const aggregation = [[
            {
              '$lookup': {
                'from': 'crops', 
                'localField': 'crop', 
                'foreignField': '_id', 
                'as': 'selectedCrop'
              }
            }, {
              '$unwind': {
                'path': '$selectedCrop'
              }
            }, {
              '$group': {
                '_id': '$selectedCrop', 
                'count': {
                  '$sum': 1
                }
              }
            }, {
              '$project': {
                '_id.name_ar': 1, 
                '_id.code': 1, 
                '_id.color': 1, 
                'count': 1
              }
            }
          ]]
         const data = await Request.aggregate(aggregation)
        res.json(data)
     }catch(error) {

     }

}