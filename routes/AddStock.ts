import { Router, Request, Response } from "express";
import { Db, Collection } from "mongodb";
import { StockInterface } from "../models/StockInterface";

const AddStock = (db: Db): Router => {
    const router = Router();

    router.post("/", async (req, res, next) => {
        try {
            const data: StockInterface = req.body;
            console.log(JSON.stringify(data));
    
            const collection: Collection<StockInterface> = db.collection("stocks");
            const result = await collection.insertOne(data);
    
            // Add history record
            await db.collection("stockHistory").insertOne({
                stockId: result.insertedId,
                operation: "Import",
                data,
                name: data.name,
                timestamp: new Date().toDateString(),
            });
    
            res.status(200).json({ message: "Stock added successfully!", reload: false, success: true });
        } catch (err) {
            console.error(err);
            next(err);
        }
    });
    
    return router;
};

export default AddStock;
