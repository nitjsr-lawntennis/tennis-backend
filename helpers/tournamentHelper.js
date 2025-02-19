export const dateCheck = async(fromDate,toDate)=>{
    var startDate = Date.parse(fromDate);
    var endDate = Date.parse(toDate);
    // console.log(startDate,endDate);
    // Make sure they are valid
        if (isNaN(startDate)) {
        return false;
    }
    if (isNaN(endDate)) {
        return false;
    }
    // Check the date range, 86400000 is the number of milliseconds in one day
    var difference = (endDate - startDate) / (86400000 * 7);
    if (difference < 0) {
        return false;
    }
    return true;
}