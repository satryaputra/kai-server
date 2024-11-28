import { Hono } from "hono";

import {
    getFare
} from "./fare.handlers.js";

const fareRoutes = new Hono()
    .get("/totalfare", getFare)

export default fareRoutes;