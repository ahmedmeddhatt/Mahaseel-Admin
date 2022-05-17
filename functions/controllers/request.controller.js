const Request = require('../models/request.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')
exports.List = async (req, res, next) => {
    try {
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 10;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
        aggregate.push({
            $match: filterSearch(req.query),
        },
            {
                $project: {
                    'code': 1,
                    'status': 1,
                    'crop': 1,
                    'cancelled' : 1,
                    'createdAt': 1,
                    'farm.name': 1,
                    'farm.owner': 1,
                }
            }
        )
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby]: parseInt(req.headers.sortvalue) || 1
                }
            }, { '$limit': limit }, { '$skip': skip },
        )
        const data = await Request.aggregate(aggregate);
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({ data, length: data.length })
    } catch (error) {
        next(error)
    }
}

/**
 * One Details with full data 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.One = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const data = await Request.findById(Id)
            .populate('crop', `-varieties -createdAt -updatedAt`)
            //.populate('farm.location.governorate')
            .populate({
                path: 'farm.location.governorate',
                model: 'location',
                select : {'name_ar' : 1 , 'code' : 1 , coordinates :1}
            })
            .populate({
                path: 'farm.location.center',
                model: 'location',
                select : {'name_ar' : 1 , 'code' : 1 , coordinates :1}
            })
            .populate({
                path: 'farm.location.hamlet',
                model: 'location',
                select : {'name_ar' : 1 , 'code' : 1 , coordinates :1}
            })
            .populate('user', `-accessToken -password`);
        if (!data) res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        res.send({ data })
    } catch (error) {
        // res.status(500).json(error)
        next(error)
    }
}

/**
 * Update DATA Details
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.Update = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const { status } = req.body;
        if (!status) { res.status(409).json({ message: ErrorMessage.INVALID_PARAMS }) }
        const data = await Request.findByIdAndUpdate(Id, { status });
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({ data: { status } })
    } catch (error) {
        res.status(500).json(error)
    }
}



/**
 * Delete Resource By ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.Delete = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Request.findOneAndRemove({
            _id: ObjectId(Id),
        });
        if (!data) {
            res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        }
        res.status(200).send({ message: ErrorMessage.SUCCESS_ACTION })
    } catch (error) {
        res.status(500).json(error)
    }
}



/**
 * this function for filter data and search availablities
 * @param {email , name , nationalId ,tradeId  ,phone , otpVerified} body 
 * @returns 
 */
const filterSearch = (body) => {
    let filter = {}
    if (body.status) {
        filter["status"] = { '$eq': body.status }
    }
    if (body.governorate) {
        filter["farm.location.governorate"] = { '$eq': ObjectId(body.governorate) }
    }
    if (body.code) {
        filter["code"] = { '$eq': body.code }
    }
    if (body.crop) {
        filter["crop"] = { '$eq': ObjectId(body.crop) }
    }
    if (body.today) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filter["createdAt"] = { '$gte': today }
    }

    return filter;
}


