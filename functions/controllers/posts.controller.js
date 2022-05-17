const Posts = require('../models/posts.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')

exports.postsList = async (req, res, next) => {
    try {
     
        let page = parseInt(req.headers.page) - 1 || 0;
        let limit = 12;
        let skip = page * limit;
        limit = limit + skip;
        var aggregate = []
        aggregate.push({
            $match: filterSearch(req.query),
            
        },
        {
            $lookup: {
                from: "topics",
                localField: "topicId",
                foreignField: "_id",
                as: "topic"
            }
        },
       
        { $unset: "topicId" },
        {$unwind: '$topic'},
        ),
        aggregate.push(
            {
                '$sort': {
                    [req.headers.sortby] : parseInt(req.headers.sortvalue) || 1
                }
            },{'$limit': limit},{'$skip': skip},
        )

        const data = await Posts.aggregate(aggregate)

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
        const { title , content ,topicId , image } = req.body;
        if (!title || !content)
         {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const posts = new Posts({
            title , content ,topicId ,image , active : true
        })
        const data = await posts.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(201).json({ data })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updatePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        const { title , content , image , topicId } = req.body;
        const data = await Posts.findByIdAndUpdate(Id, { title , content , image , topicId  });
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
        let data = await Posts.findOneAndRemove({
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
        let data = await Posts.findByIdAndUpdate(Id , {active : true});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}

exports.deactivePost = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Posts.findByIdAndUpdate(Id , {active : false});
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
    if (body.content) {
        filter["content"] = { '$regex': body.content }
    }
    if (body.topicId) {
        filter["topicId"] = { '$eq':ObjectId (body.topicId) }
    }
    
    return filter;
}