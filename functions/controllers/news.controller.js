const News = require('../models/News.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')
const scrape = require('../utils/scraping')

exports.postsList = async (req, res, next) => {
    try {
     
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 10;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
        aggregate.push({
            $match: filterSearch(req.query),
            
        }
        ),
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )

        const data = await News.aggregate(aggregate)

        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({  Results: data.length ,data})
    } catch (error) {
        next(error)
    }
}


exports.createPost  = async (req, res, next) => {
    try {
        for(const { title , describtion , source } of scrape){
            if (!title || !describtion || !source)
            {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })};
           const data = await News.create({title , describtion ,source}) ;
           console.log('data', data);
           if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(201).json({ data })
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const { title , describtion ,source } = req.body;
        const data = await News.findByIdAndUpdate(Id, { title , describtion, source});
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({data})
    } catch (error) {
        console.log('error',error);
        res.status(500).json(error)
    }
}

exports.deletePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await News.findOneAndRemove({
            _id: ObjectId(Id),
        });
        if (!data) {
            res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        }
        res.status(200).send({ message: ErrorMessage.SUCCESS_ACTION })
    } catch (error) {
        console.log('error' , error);
        res.status(500).json(error)
    }
}

exports.activePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await News.findByIdAndUpdate(Id , {active : true});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}

exports.deactivePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await News.findByIdAndUpdate(Id , {active : false});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}




 const filterSearch = (body) => {
    let filter = {}
    if (!body) { return filter}

    
    if (body.title) {
        filter["title"] = { '$regex': body.title }
    }
    if (body.describtion) {
        filter["describtion"] = { '$regex': body.describtion }
    }
    if (body.topicId) {
        filter["topicId"] = { '$eq':ObjectId (body.topicId) }
    }
    
    return filter;
}