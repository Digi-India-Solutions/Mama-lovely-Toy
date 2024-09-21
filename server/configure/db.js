const mongoose = require('mongoose');

exports.connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGOOURL);
        console.log("Mama Lovely Toy Connected Succesfully !!");
    } catch (error) {
        console.error("Error : ",error);
    }
}