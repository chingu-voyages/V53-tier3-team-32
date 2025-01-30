import { User } from "../models/schemas/User";
import { Request, Response } from "express";

const createUser = (async (req: Request, res: Response) => {

    const { email, username, password } = req.body;

    const emailCheck = await User.find({ email })
    if (emailCheck.length > 0) {
      res.status(400).json({
        message: 'E-mail address is already been used',
        success: false
      })
      return
    }

    try{
        await User.create({
            email,
            username,
            password
        })
        
    } catch(err){
        res.status(404).send(err)
    }
       

   } );

export default { createUser }