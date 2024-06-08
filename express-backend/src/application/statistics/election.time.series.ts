import formatDate from "./statistics.helper.function";
import { RangeEnum } from "./statistics.models";

function calculateTimeSeriesDistribution(timestamps: number[], range: RangeEnum): Record<string, number> {
    const distribution: Record<string, number> = {};
    if(timestamps.length < 1){
        return distribution
    }
    timestamps.forEach((timestamp) => {
        const formattedDate = formatDate(timestamp, range);
        if (distribution[formattedDate]) {
            distribution[formattedDate]++;
        } else {
            distribution[formattedDate] = 1;
        }
    });

    return distribution;
}
export {calculateTimeSeriesDistribution}
