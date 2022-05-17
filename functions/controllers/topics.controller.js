const Topics = require('../models/topics.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')



exports.topicsList = async (req, res, next) => {
    try {
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 10;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
        aggregate.push({
            $match: filterSearch(req.query),
        }),
           
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )
        const data = await Topics.aggregate(aggregate);
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({  Results: data.length ,data})
    } catch (error) {
        next(error)
    }
}



exports.createTopic  = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name)
         {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const topics = new Topics({
            name  , active : true
        })
        const data = await topics.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateTopic = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const { name } = req.body;
        const data = await Topics.findByIdAndUpdate(Id, { name  });
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({data:{ Id , name    }})
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteTopic = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Topics.findOneAndRemove({
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

exports.activeTopic = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Topics.findByIdAndUpdate(Id , {active : true});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}

exports.deactiveTopic = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Topics.findByIdAndUpdate(Id , {active : false});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}



 const filterSearch = (body) => {
    let filter = {}
    if (!body) { return filter}
    // if (body.tourId) {
    //     filter["tourId"] = { '$regex': body.tourId }
    // }
    if (body.name) {
        filter["name"] = { '$regex': body.name }
    }
    return filter;
}