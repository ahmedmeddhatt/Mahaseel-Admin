const User = require('../models/user.model');
const Message = require('../models/message.model');
const Request = require('../models/request.model');
const Farm = require('../models/farm.model');

const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../../assets/errors')

const fcm = require('../services/fcm.service');

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
                    'name': 1,
                    'email': 1,
                    'phone': 1,
                    'nationalId': 1,
                    'tradeId': 1,
                    'otpVerified': 1,
                    'createdAt': 1,
                }
            }
        )
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )
        const data = await User.aggregate(aggregate);
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
        const data = await User.findById(Id).select({
            'accessToken': 0,
            'password': 0,
            'fcm': 0,
        })
        const messages = await Message.find({user : ObjectId(Id)}).select({
            'user': 0,
        }).sort({createdAt: -1}).limit(10)
        const requests = await Request.find({user : ObjectId(Id)}).select({
            'user': 0,
            'location': 0,
            'varieties': 0,
            'quality': 0,
        }).sort({createdAt: -1}).limit(10)

         const farms = await Farm.find({user : ObjectId(Id)});
        if (!data) res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        res.send({ data , messages , requests ,  farms})
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
        const { email, name, nationalId, tradeId } = req.body;
        const data = await User.findByIdAndUpdate(Id, { email, name, nationalId, tradeId }).select({
            'accessToken': 0,
            'password': 0,
            'fcm': 0,
        })
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({ data: { email, name, nationalId, tradeId } })
    } catch (error) {
        res.status(500).json(error)
    }
}

/**
 * send messgae to one user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.SendMessage = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
        if (!title || !content) {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const user = await User.findById(id);
        if(!user){res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })}
        const message = new Message({
           user : user._id , title, content 
        })
        const data = await message.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        // send notification here FCM 
        //let fcmtoken = "fbocGwrqQOGCwtP-G9YxvS:APA91bEEnb-uLSqx5Jx_XF518oSCVuaTrlsfS1VSVqBkQDGgmMQG6mfzoVFsI5LraXMokBRcHUMO-ZkTqT19n5NBfnYtWSNTUuiUnXmM9q-13CnSDBrVDPJbaLdAoTgBU4O2jyeoc5MM";
        fcm.SendByToken(user.fcm,title,{
            key: 'screen',
            value: 'inbox'
      })
        // use user.fcm var
        res.status(200).json({ data })
    } catch (error) {
        // res.status(500).json(error)
        next(error)
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
        let data = await User.findOneAndRemove({
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
    let filter = {
        role: 'client'
    }
    if (!body) { return filter}
    if (body.email) {
        filter["email"] = { '$regex': body.email }
    }
    if (body.name) {
        filter["name"] = { '$regex': body.name }
    }
    if (body.nationalId) {
        filter["nationalId"] = { '$eq': body.nationalId }
    }
    if (body.tradeId) {
        filter["tradeId"] = { '$eq': body.tradeId }
    }
    if (body.phone) {
        filter["phone"] = { '$eq': '+2'+body.phone }
    }
    if (body.otpVerified === '1') {
        filter["otpVerified"] = true
    }
    if (body.otpVerified === '0') {
        filter["otpVerified"] = false
    }
    return filter;
}

exports.NotifyGroup = async (req , res ,next) => {
    try {
        const {message , crop , governorate} = req.body;
        if(!message || !crop || !governorate) {
            res.status(409).json({message : "invalid body params"})
        }
        if(crop == 'global' || governorate == 'global') {
            // send to topic global
            fcm.SendByToken(`/topics/global`,"🔔" + message , {
                key: 'screen',
                value: 'inbox'
            })
            res.json({ message : "sent to all users"})
        }
        else {
            fcm.SendByToken(`/topics/${crop}`,message , {
                key: 'screen',
                value: 'inbox'
            })
            fcm.SendByToken(`/topics/${governorate}`,message , {
                key: 'screen',
                value: 'inbox'
            })
            res.json({ message : "sent to spesific topics" , crop , governorate })
        }
        
    }catch(e) {
        next(e)
    }
}


