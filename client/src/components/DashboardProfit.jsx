import React, { Component, useEffect, useState} from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import {getBalance,newProfit,getProfit,deleteProfit,getAccessToken} from "../api";
import moment from 'moment';
import * as XLSX from 'xlsx';
import Button from '@mui/material/Button';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from '@mui/material/Alert';

const DashboardProfit = () => {
    const [arr, setArr] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showProgress,setShowProgress] = useState(false);
    const [show,setShow] = useState(false);
    const [showDisabled,setshowDisabled] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShow(false);
        },3000)
        return () => clearInterval(interval);
      }, []);

    const jsonToSheet = (json) => {
        const sheet = XLSX.utils.json_to_sheet(json);
        return sheet;
    }

    const exportToExcel = (json) => {
        const d_start = moment(new Date(startDate)).format("YYYY-MM-DD");
        const d_end = moment(new Date(endDate)).format("YYYY-MM-DD");
        json.push({date: "Revenue", total_balance: (json[1].total_balance - json[0].total_balance)});
        const sheet = jsonToSheet(json);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1');
        XLSX.writeFile(wb,d_start + " to " + d_end + ' Profit' + '.xlsx');
        json.pop();
    }

    const exportExcel = (data) => {
        exportToExcel(data);
    }

    const getData = async () => {
        setShowProgress(true)
        setArr([]);
        const arr = [];
        const access_Token = await getAccessToken();
        if(new Date(endDate).getTime() > new Date(startDate).getTime()){
            if(startDate !== ""){
                const start_date = moment(startDate).format("YYYY-MM-DD");
                const dataStart = await getBalance(access_Token.data.access_token,start_date);
                arr.push({date: start_date,total_balance: parseFloat(dataStart.balances[0].total_balance.value)});
            }
            if(endDate !== ""){
                const end_date = moment(endDate).format("YYYY-MM-DD");
                const dataEnd = await getBalance(access_Token.data.access_token,end_date);
                arr.push({date: end_date,total_balance: parseFloat(dataEnd.balances[0].total_balance.value)});
            }
            setshowDisabled(false);
        }else{
            setShow(true);
            setshowDisabled(true);
        }
        setShowProgress(false);
        setArr(arr)
    }

    console.log(arr);
  return (
    <div>
        {
              show === true ? (<Alert severity="error">
              <p>Invalid or Missing Informations</p>
              <p>End Date should be after Start Date </p>
            </Alert>) : (<></>)
        }
        <p className='mb-4 text-4xl text-4xlfont-medium text-gray-900 flex items-center justify-center'>Profit</p>
        <div className='flex flex-row ml-20'>  
            <div>StartDate: <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} /></div>
            <div>EndDate: <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} /></div>
            <Button variant='contained' color='success' onClick={getData}>Get Data Chart</Button>
            <Button disabled={showDisabled} style={{marginLeft: 10}} color='info' variant='contained' className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex' onClick = {() => exportExcel(arr)}>
                <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" /></svg>
                <span>Export</span>
            </Button>
        </div>
        {
            arr.length === 0 ? (<h1 className='flex items-center justify-center mt-40 font-sans text-textColor' style={{fontSize: 30}}>No Data</h1>) : 
            <ResponsiveContainer className="chart mt-24" height={300}>
            <LineChart
                width={600}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                data={arr}
            >
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total_balance" stroke="#82ca9d" />
            </LineChart>
            </ResponsiveContainer>
        }
        {
            showProgress === true ? (
                <div className='flex items-center justify-center mb-60' role="status">
                <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            ) : (<></>)
        }
    </div>
  )
}

export default DashboardProfit

