import * as express from 'express';
import {ExpressJoiError} from "express-joi-validation";

import router from "./controllers/users";

const app = express();

app.use(express.json());
app.use(router);
app.use((err: any | ExpressJoiError, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && err.error && err.error.isJoi) {
        const e: ExpressJoiError = err;
        res.sendStatus(400);
    } else {
        res.sendStatus(500);
    }
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} port`);
});
