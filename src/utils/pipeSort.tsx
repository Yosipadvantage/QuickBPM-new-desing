
export const pipeSort = (array: any[], columna: string) => {
    try {
        array.forEach((item: any) => {
            if (!item[columna]) {
                item[columna] = '';
            }
        })
        console.log(array);
        let auxArray = columna !== 'Since' ? [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())) : [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())).reverse()
        return auxArray
    } catch (error) {
        console.log(error);
        return array;
    }
}

export const pipeSortIDAce = (array: any[], columna: string) => {
    try {
        array.forEach((item: any) => {
            if (!item[columna]) {
                item[columna] = '';
            }
        })
        let auxArray = columna !== 'Since' ? [...array].sort((a: any, b: any) => a[columna] - b[columna]) : [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())).reverse()
        return auxArray
    } catch (error) {
        console.log(error);
        return array;
    }
}

export const pipeSortIDDec = (array: any[], columna: string) => {
    try {
        array.forEach((item: any) => {
            if (!item[columna]) {
                item[columna] = '';
            }
        })
        let auxArray = columna !== 'Since' ? [...array].sort((a: any, b: any) => b[columna] - a[columna]) : [...array].sort((a: any, b: any) => a[columna].toString().localeCompare(b[columna].toString())).reverse()
        return auxArray
    } catch (error) {
        console.log(error);
        return array;
    }
}

export const pipeSortDate = (array: any[], columna: string) => {
    array.forEach((item: any) => {
        if (!item[columna]) {
            item[columna] = '';
        }
    })
    return [...array].sort(function (a: any, b: any) {

        let date1 = a[columna].toString().split(' ')[0].split('-');
        let date2 = a[columna].toString().split(' ')[0].split('-');

        return new Date(parseInt(date1[0]), (parseInt(date1[1]) - 1), parseInt(date1[2])).getTime() - new Date(parseInt(date2[0]), (parseInt(date2[1]) - 1), parseInt(date2[2])).getTime();
    })
}






