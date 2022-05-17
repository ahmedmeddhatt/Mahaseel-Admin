const NewsLetter = require('../models/newsletter.model');



exports.subscribersList = async (req, res, next) => {
    try {
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 10;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
      
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )
        const data = await NewsLetter.aggregate(aggregate);
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({  Results: data.length ,data})
    } catch (error) {
        next(error)
    }
}


exports.createSubscriber  = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email)
         {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const newsLetter = new NewsLetter({
            email  , active : true
        })
        const data = await newsLetter.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json(error)
    }
}


exports.Active = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await NewsLetter.findByIdAndUpdate(Id , {active : true});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}

exports.Deactive = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await NewsLetter.findByIdAndUpdate(Id , {active : false});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}