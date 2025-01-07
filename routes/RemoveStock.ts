import { Router, Request, Response, NextFunction } from "express";
import { Db, Collection, ObjectId } from "mongodb";
import { StockInterface } from "../models/StockInterface";

const RemoveStock = (db: Db): Router => {
    const router = Router();

    router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stockId = req.params.id;
            if (!ObjectId.isValid(stockId)) {
                res.status(400);
                return;
            }
    
            const oldData = await db.collection<StockInterface>("stocks").findOne({ _id: new ObjectId(stockId) });
    
            const result = await db
                .collection<StockInterface>("stocks")
                .deleteOne({ _id: new ObjectId(stockId) });
    
            if (result.deletedCount === 0) {
                res.status(400).json({ message: "Stock not found" });
                return;
            }
    
            // Add history record
    
            res.status(200).json({ _id: new ObjectId(stockId) });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });
    

    return router;
};

export default RemoveStock;
