import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

// import { closeSnackbar, enqueueSnackbar } from 'notistack';
import React from 'react';
import XLSX from 'xlsx';
import { selectDataExcel, useTkbStore } from '../../zus';
// import { tracker } from '../..';
import { HTMLCalendarParser, startTime2TietMapping, endTime2TietMapping, arrayToTkbObject, sheetJSFT, toDateTimeString } from './utils';
import {UIT_htmlFileProcessing, UIT_xlsxFileProcessing} from './file_format_processor'

const Bold = ({ children }) => <b style={{ marginLeft: 5 }}>{children}</b>;

//const currentFileProcessing = UIT_xlsxFileProcessing;
const currentFileProcessing = UIT_htmlFileProcessing;

function SelectExcelButton() {
    const dataExcel = useTkbStore(selectDataExcel) || {};
    //const dataExcel = {};
    const setDataExcel = useTkbStore((s) => s.setDataExcel);

    const handleUploadFileExcel = React.useCallback(
        // TODO: currently there are no checking of the excel content format 
        // just upload any excel file will work
        event => {
            const file = event.target.files?.[0]
            if (!file) return
            const reader = new FileReader()
            const rABS = !!reader.readAsBinaryString
            reader.onload = e => {
                const success = currentFileProcessing(e, rABS, setDataExcel, file);
                if(success) {
                    // enqueueSnackbar(
                    //     <>
                    //         Upload file thành công <Bold>{file.name}</Bold>
                    //     </>,
                    //     {
                    //         variant: "success",
                    //         action: key => (
                    //             <Button
                    //                 size="small"
                    //                 color="inherit"
                    //                 onClick={() => {
                    //                     closeSnackbar(key)
                    //                 }}
                    //             >
                    //                 Đã hiểu
                    //             </Button>
                    //         )
                    //     }
                    // )
                    // tracker.track("[page1] upload_excel_resulted", {
                    //     success: true,
                    //     fileName: file.name
                    // })
                } else {
                    // enqueueSnackbar("Không đúng định dạng file của trường", {
                    //     variant: "error"
                    // })
                    //tracker.track("[page1] upload_excel_resulted", { success: false })
                }
            }

            //FIXME: different files format use different reader, try some way to abstract this out, ASAP
            console.log('FIXME: different files format use different reader, try some way to abstract this out, ASAP');
            // if (rABS) reader.readAsBinaryString(file)
            // else if() reader.readAsArrayBuffer(file)
            // else reader.readAsText(file, 'UTF-8');
            reader.readAsText(file, 'UTF-8');

        },
        [setDataExcel]
    )
    console.log(dataExcel);

    return (
        <Box mt={1} mb={2}>
            {/* File uploader with material-ui: https://stackoverflow.com/a/54043619/9787887*/}
            <Tooltip title={dataExcel.fileName || 'Chưa upload file'}>
                <Button
                    variant={'contained'}
                    color={dataExcel.lastUpdate ? 'success' : 'primary'}
                    component="label"
                    style={dataExcel.lastUpdate ? undefined : { fontWeight: 'bold' }}
                >
                    {dataExcel?.lastUpdate ? (
                        <>
                            <span>Đã upload: </span> <Bold>{dataExcel.lastUpdate}</Bold>
                        </>
                    ) : (
                            'Upload file excel'
                        )}
                    <input
                        type="file"
                        style={{ display: 'none' }}
                        accept={sheetJSFT}
                        acceptCharset="UTF-8" // Add this line
                        onChange={handleUploadFileExcel}
                        onClick={() => {
                            // tracker.track('[page1] btn_upload_excel_clicked');
                        }}
                    />
                </Button>
            </Tooltip>
            <span style={{ marginLeft: '10px' }}>
                Ví dụ file excel{' '}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://daa.uit.edu.vn/thong-bao-lich-dkhp-va-tkb-du-kien-hk2-nam-hoc-2023-2024"
                    onClick={() => {
                        // tracker.track('[page1] link_excel_hk2_2023_2024_original_clicked');
                    }}
                >
                    chính quy HK2 2023-2024
                </a>
                :{' '}
                <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.google.com/spreadsheets/d/e/2PACX-1vRyf8-kMRTo4CllfPA4sjbjxkhGhR1tT7yD1HASjmClqTwwkJBgWRvuxJPIAK8Wdw/pub?output=xlsx"
                    onClick={() => {
                        // tracker.track('[page1] link_excel_hk2_2023_2024_clicked');
                    }}
                >
                    TKB_dự kiến_HK2 2023-2024_29-12-2023_Copied.xlsx
                </a>{' '}
            </span>
        </Box>
    );
}

export default SelectExcelButton;