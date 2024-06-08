import {RangeEnum} from './statistics.models'
export default function formatDate(date: number, range: RangeEnum) {
    const d = new Date(date * 1000); 
    let formattedDate;
    switch (range) {
        case RangeEnum.MONTHLY:
            formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            break;
        case RangeEnum.WEEKLY:
            const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
            formattedDate = `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
            break;
        case RangeEnum.YEARLY:
            formattedDate = `${d.getFullYear()}`;
            break;
        default:
            throw new Error('Invalid range');
    }
    return formattedDate;
}