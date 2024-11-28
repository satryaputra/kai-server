import { Context } from "hono";
import db from "../../lib/db";

export async function getFare(c: Context) {
    const { departure, destination } = c.req.query();

    const [departureStation, destinationStation] = await Promise.all([
        db.station.findFirst({ where: { name: departure } }),
        db.station.findFirst({ where: { name: destination } }),
    ]);

    const startLines = await db.routes.findMany({
        where: { stationId: departureStation?.id },
        include: { line: true }, // Get the line details
    });

    const endLines = await db.routes.findMany({
        where: { stationId: destinationStation?.id },
        include: { line: true }, // Get the line details
    });

    const commonLines = startLines
        .map((startRoute) => startRoute.line.id)
        .filter((lineId) =>
            endLines.some((endRoute) => endRoute.line.id === lineId)
        );

    let totalFare = 0;
    for (const lineId of commonLines) {
        const lineFare = await db.fare.findFirst({
            where: { lineId: lineId },
        });

        if (lineFare) {
            totalFare += lineFare.price; // Add fare for the line
        }
    }

    if (totalFare) {
        return c.json({ totalFare: totalFare }, 200);
    }

    return c.json({ error: "failed to calculate fare" }, 500);
}