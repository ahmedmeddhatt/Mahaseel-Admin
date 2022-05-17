const user = require('../models/user.model');


exports.run = async (req,res ,next) => {
    const newUser = new User({
        name : "",
        email : "admin@mail.com", 
        phone : "+201015538744",
        nationalId : "25365236985410", 
        password: hashedPassword, 
        role: "client" 
    });
    const accessToken = jwt.sign({ userId: newUser._id , role: newUser.role }, process.env.JWT_SECRET, {
        expiresIn: "10d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    try {
       //  await l.save()
        res.send(await model.find())
    }
    catch (error) {
        next(error)
    }

}
 