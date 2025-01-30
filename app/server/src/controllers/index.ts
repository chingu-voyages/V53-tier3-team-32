import { Request,Response } from "express";

const index  =( (req: Request, res:Response) =>{
    console.log("hello world");
    res.send("index");
});

const register  =( (req: Request, res:Response) =>{
    res.send("register");
});


export default {index,register};
