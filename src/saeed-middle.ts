import { Express } from "express";

export const saeedMiddleProvider = () =>{
    const apply = (app:Express) =>{
        app.get('/sas',(_, res)=>{
            res.send("berno");
        });
        app.get('/saeed',(_, res)=>{
            res.send("saeed");
        });
    }
    return {apply};
}