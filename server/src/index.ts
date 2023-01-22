import {config} from "dotenv"
config();
import app, {PORT} from './app'
import { runMigrations } from "./config/db";

async function startServer (port:number) {
    try {
        await runMigrations()
        app.listen(port, () => {console.log(`server started on port ${port}`)})
    } catch (err) {
        throw err
    }
}

startServer(PORT)