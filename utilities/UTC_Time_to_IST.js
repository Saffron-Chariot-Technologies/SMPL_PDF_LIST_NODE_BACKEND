
export function getIndianTimestamp() {
    const currentDate = new Date();
    const options = { timeZone: "Asia/Kolkata", hour12: true };
    const indianDate = currentDate.toLocaleString("en-IN", options);
    return indianDate;
}