const XLSX = require('xlsx');
const axios = require('axios');

const isURL = (url) => {
    return (/^https?:\/\//.test(url)); 
}

const localStorage = {
    getItem: (somethign) => null, 
    setItem: (one, two) => null, 
}; 

const fetchAndParseXlsx = async (url) => {
    if(!isURL(url)) throw new Error("Filename suppose to be a URL");
    let workbook = undefined; 

    if(localStorage.getItem(url)) {
        workbook = localStorage.getItem(url);

    } else {
        try {
            // Fetch the XLSX file from the URL
            const response = await axios({
                url,
                method: 'GET',
                responseType: 'arraybuffer'
            });

            // Convert the data to a buffer
            const data = Buffer.from(response.data, 'binary');

            // Parse the buffer into a workbook
            workbook = XLSX.read(data, { type: 'buffer' });

        } catch (error) {
            console.error('Error fetching or parsing the XLSX file:', error);
        }
    }
    // For example, get the first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Output the JSON data
    return jsonData; 

    // const bstr = ; // TODO: what does xlsx expect the input would be  ??
    //
    // const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
    // const wsLyThuyet = wb.Sheets[wb.SheetNames[0]];
    // const wsThucHanh = wb.Sheets[wb.SheetNames[1]];
    // const dataLyThuyet = XLSX.utils.sheet_to_json<any[][]>(wsLyThuyet, { header: 1 });
    // const dataThucHanh = XLSX.utils.sheet_to_json<any[][]>(wsThucHanh, { header: 1 });
    // const dataInArray = [...dataLyThuyet, ...dataThucHanh].filter(
    //     (row) => typeof row[0] === 'number', // những row có cột 0 là STT (STT là number) thì mới là data ta cần
    // );
    //
    // if (dataInArray.length) {
    //     // TODO: Mantually write the damn thing into localstorage
    //     const data = dataInArray.map((array) => arrayToTkbObject(array))
    //     return data;
    //
    //     // setDataExcel({
    //     //     data: ,
    //     //     fileName: file.name,
    //     //     lastUpdate: toDateTimeString(new Date()),
    //     // });
    // }
}

fetchAndParseXlsx("https://student.uit.edu.vn/sites/daa/files/202405/lichthi_dotthi_1_l2_hk2_nh2023_thong_bao.xlsx").then(res => {
    console.log(res);
})
