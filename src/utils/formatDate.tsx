export const formatDate = (date: Date | null) => {
    let dateFormated: string = "";
    if (date !== null) {
        dateFormated = date.getFullYear() + "-" + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getDate();
    } else {
        return "";
    }
    return dateFormated + ' 00:00:00';
};

export const formatDateHours = (date: Date | null) => {
    let dateFormated: string = "";
    let hourFormated: string = "";
    if (date !== null) {
        dateFormated = date.getFullYear() + "-" + ((date.getMonth() + 1) <= 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" + date.getDate();
        hourFormated = date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ":" + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    } else {
        return "";
    }
    return dateFormated + ' ' + hourFormated;
};