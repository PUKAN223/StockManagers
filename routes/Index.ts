import { MongoClient, Db } from "mongodb";
import express, { Express } from "express";
import "colors";
import * as dotenv from "dotenv";
import fs from "fs";
import https from "https";
import AddStock from "./AddStock";
import RemoveStock from "./RemoveStock";
import EditStock from "./EditStock";
import GetAllStock from "./GetAllStock";
import cors from "cors";
import { GetHistory } from "./GetHistory";

dotenv.config();

const PORT: number = process.env.PORT as any || 8080;
const app: Express = express();

// MongoDB connection
const url = `mongodb+srv://admin:Pukan221op23@cluster0.jkuu4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(url);

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

(async () => {
    const db: Db = client.db("stockDB");

    // MongoDB connection
    client.connect()
        .then(() => {
            console.log(`[✅] ${"MongoDB Connected..".green}`);
        })
        .catch((err) => {
            console.error(`[❌] ${"MongoDB Connect Fail..".red}`, err);
            process.exit(1);
        });

    // Routes for stock management
    app.use("/api/stock/add", AddStock(db));
    app.use("/api/stock/remove", RemoveStock(db));
    app.use("/api/stock/edit", EditStock(db));
    app.use("/api/stock/get", GetAllStock(db));
    app.use("/api/history/get", GetHistory(db));

    // Start HTTPS server
    https.createServer(app).listen(PORT, () => {
        console.log(`[✅] HTTP server running on http://localhost:${PORT}`);
    });
})();


