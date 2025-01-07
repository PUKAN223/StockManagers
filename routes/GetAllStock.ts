import { Router, Request, Response, NextFunction } from "express";
import { Db } from "mongodb";
import { StockInterface } from "../models/StockInterface";

const GetAllStock = (db: Db): Router => {
  const router = Router();

  router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Fetching all stocks...");
      const stocks = await db.collection<StockInterface>("stocks").find().toArray();

      if (stocks.length === 0) {
        // Changed status code to 404 (Not Found) when no stocks are found
        res.status(404).json({ message: "No stocks found" });
        return;
      }

      // Return the fetched stocks with a 200 OK status code
      res.status(200).json(stocks);
    } catch (err) {
      console.error(err);
      next(err); // Let the error be handled by Express error handler
    }
  });

  return router;
};

export default GetAllStock;
