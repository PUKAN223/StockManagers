import { Db, ObjectId } from "mongodb";
import { Router, Request, Response, NextFunction } from "express";

export const GetHistory = (db: Db): Router => {
    const router = Router();

    router.get("/:id", async (req: Request, res: Response) => {
        const stockId = req.params.id;
    
        if (!ObjectId.isValid(stockId)) {
            res.status(400).json({ message: "Invalid stock ID" });
            return;
        }
    
        const history = await db.collection("stockHistory").find({ stockId: new ObjectId(stockId) }).toArray();
        res.status(200).json(history);
    });
    return router
}