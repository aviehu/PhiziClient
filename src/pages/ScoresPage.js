import React from 'react';
import {useContext, useState, useEffect} from "react";
import api from "../util/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: 'Chart.js Line Chart - Multi Axis',
    },
  },
  scales: {
    y: {
      type: 'linear',
      display: true,
      position: 'left',
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};





export default function ScorePage(myUser) {
    const [userScores,setUserScores] = useState(null)
    const [labels, setLabels] = useState(null)
    const [data, setData] = useState(null)

    async function getUserScores() {
        const response = await api.getUserScores(myUser)
        if (response.error) {
            return
        }
        const sets = response.map((score) => {return {
            label: score.session,
            data: labels.map(() => 5),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            yAxisID: score.session,
        }})
        setData({
            labels,
            datasets: [...sets]
          })
        setUserScores(response)
    }

    function generateLables() {
        const today = Date.today()
        const month = today.getMonth()
        const year = today.getYear()
        const daysInMonth = Date.getDaysInMonth(year, month)
        setLabels(daysInMonth)
    }

    useEffect(() => {
        async function load() {
            generateLables()
            getUserScores()
        }
        load()
    }, [])


  return(
    <div style={{ position: 'absolute', width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:60}}>
        <Line options={options} data={data} />;
    </div>
  )
   
}
