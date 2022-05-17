const Crop = require('../models/crop.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')
exports.List = async (req, res, next) => {
    try {
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 30;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
        aggregate.push({
            $match: filterSearch(req.query),
        },
        )
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )
        const data = await Crop.aggregate(aggregate);
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
        const data = await Crop.findById(Id);
        if (!data) res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        res.send({ data })
    } catch (error) {
        res.status(500).json(error)
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
        const { name_ar, name_en, code, active  ,varieties } = req.body;
        const data = await Crop.findByIdAndUpdate(Id, { name_ar, name_en, code, active , varieties });
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({data:{ name_ar, name_en, code, active  ,varieties }})
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.Create = async (req, res, next) => {
    try {
        const { name_ar, name_en , code , varieties } = req.body;
        if (!name_ar || !name_en || !code || !varieties) {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const crop = new Crop({
            name_ar, name_en ,  code , varieties
        })
        const data = await crop.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({ data })
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
        let data = await Crop.findOneAndRemove({
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
    if (body.name_ar) {
        filter["name_ar"] = { '$regex': body.name_ar }
    }
    if (body.name_en) {
        filter["name_en"] = { '$regex': body.name_en }
    }
    if (body.code) {
        filter["code"] = { '$eq': body.code }
    }
    if (body.active === true) {
        filter["active"] = true
    }
    return filter;
}


