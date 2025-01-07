import { Router, Request, Response, NextFunction } from "express";
import { Db, ObjectId } from "mongodb";
import { StockInterface } from "../models/StockInterface";

const EditStock = (db: Db): Router => {
    const router = Router();

    router.put("/:id/:action", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stockId = req.params.id;
            const updateData: StockInterface = req.body;
    
            if (!ObjectId.isValid(stockId)) {
                res.status(400).json({ message: "Invalid stock ID" });
                return;
            }
    
            const oldData = await db.collection<StockInterface>("stocks").findOne({ _id: new ObjectId(stockId) });
    
            const result = await db
                .collection<StockInterface>("stocks")
                .updateOne(
                    { _id: new ObjectId(stockId) },
                    { $set: updateData }
                );
    
            if (result.matchedCount === 0) {
                res.status(404).json({ message: "Stock not found", success: false });
                return;
            }
    
            // Add history record
            await db.collection("stockHistory").insertOne({
                stockId: new ObjectId(stockId),
                operation: req.params.action,
                oldData,
                newData: updateData,
                name: updateData.name,
                timestamp: new Date().toDateString(),
            });
    
            res.status(200).json({ message: "Stock updated successfully!", reload: false, success: true });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    return router;
};

export default EditStock;
