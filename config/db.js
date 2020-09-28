const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log('DB conectada');
    } catch (error) {
        console.log(error);
        //Detiene la app
        process.exit(1);
    }
}

module.exports = conectarDB;
