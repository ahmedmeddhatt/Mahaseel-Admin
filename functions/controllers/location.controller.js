const Location = require('../models/location.model');
const ObjectId = require("mongoose").Types.ObjectId;
const { ErrorMessage } = require('../assets/errors')

exports.Governorates = async (req, res) => {
    try {
        let data = await Location.find({type : 'governorate'   , parent : null}).select({
            'parent' :0,
        });
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({ data, length: data.length })
    } catch (error) {
        res.status(500).json({
            message : error
        })
    }

}

exports.Centers = async (req, res) => {
    try {
        const governorateid  = req.params.governorateid;
        console.log(governorateid)
        let data = await Location.find({type : 'center' , parent : ObjectId(governorateid)}).select({
            'parent' :0,
     
        });
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({ data, length: data.length })
    } catch (error) {
        res.status(500).json({
            message : error
        })
    }

}

exports.Hamlets = async (req, res, next) => {
    try {
        const centerid  = req.params.centerid;
        let data = await Location.find({ type : 'hamlet' ,  parent : ObjectId(centerid)}).select({
            'parent' :0,
           
        });
        if (!data) {
            res.status(204).json({ message: ErrorMessage.NO_CONTENT })
        }
        res.send({ data, length: data.length })
    } catch (error) {
        res.status(500).json({
            message : error
        })
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
        const { name_ar, name_en , code , type , active , parent , coordinates } = req.body;
        const data = await Location.findByIdAndUpdate(Id, { name_ar, name_en, code ,active , type , parent , coordinates  });
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(200).json({data:{ Id , name_ar, name_en, code , type ,active ,parent , coordinates  }})
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.Create = async (req, res, next) => {
    try {
        const { name_ar, name_en , code , type , parent , coordinates } = req.body;
        if (!name_ar || !name_en || !code || !type) {res.status(409).json({ message: ErrorMessage.INVALID_PARAMS })}
        const location = new Location({
            name_ar, name_en ,  code , type , parent ,coordinates
        })
        const data = await location.save()
        if (!data) res.status(409).json({ message: ErrorMessage.NO_RESOURCE_FOUND })
        res.status(201).json({ data })
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
        let data = await Location.findOneAndRemove({
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
 * Deactive Resource By ID
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
 exports.Active = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Location.findByIdAndUpdate(Id , {active : true});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}

exports.Deactive = async (req, res, next) => {
    try {
        const Id = req.params.id;
        let data = await Location.findByIdAndUpdate(Id , {active : false});
        res.status(200).send({data})
    } catch (error) {
        next(error)
    }
}
