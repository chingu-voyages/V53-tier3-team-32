import mongoose from "mongoose";
import { config } from 'dotenv';
config();

const mongodburi: string = process.env.DB_CONN_STRING!;
const db_name: string = process.env.DB_NAME!;

class DB{
    private static instance: mongoose.Connection;

    public static connect(){

        if(!DB.instance){
            DB.instance = mongoose.createConnection(mongodburi)
            console.log('db connectod')
            console.log(db_name + " " + mongodburi)
        }
        return DB.instance
    }
}

export default DB.connect().useDb(db_name)