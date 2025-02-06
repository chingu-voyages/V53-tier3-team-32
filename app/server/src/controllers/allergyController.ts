import { Allergy } from "../models/schemas/Allergy";
import { Request, Response } from "express";

// add and allergy to collection
const createAllergy = ( async (req: Request, res: Response) => {
    const { name } = req.body;

    const allergyExists = await Allergy.findOne({name: name});
    if(allergyExists){
        res.send({ msg: "Allergy exists"});
        return
    };

    const newAllergy = await Allergy.create({name});
    if(newAllergy){
        res.send({msg: "Allergy added succesfully"});
    }

});

// remove allergy from collection
const deleteAllergy = ( async (req: Request, res: Response) => {
    const { name } = req.body;

    const allergyExists = await Allergy.findOne({name: name});
    if(allergyExists){
        const deletedAllergy = await Allergy.deleteOne({name: name});
        if(deletedAllergy ){
            res.send({msg: "item deleted"});
            return
        }
        else{
            res.send({msg: "error deleting"});
            return

        }
    };

}); 

// increment allergy count when added to user
const allergyCountInc= ( async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await Allergy.updateOne({name: name},{ $inc : { count: +1 }});
    if(result){
        res.send({ msg: "Count Update"});
        return;
    }
    else{
        res.send({ err: "Error updating count"});
        return;
    }

});

// decrement allergy count when deleted from user
const allergyCountDec = ( async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await Allergy.updateOne({name: name},{ $inc : { count: -1 }});
    if(result){
        res.send({ msg: "Count Update"});
        return;
    }
    else{
        res.send({ err: "Error updating count"});
        return;
    }

});


export default { createAllergy ,deleteAllergy  ,allergyCountInc,allergyCountDec };