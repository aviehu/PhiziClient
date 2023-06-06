import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem, TablePagination,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../util/api';

export default function ScoreTable() {
    const [scores, setScores] = useState([]);
    const [users, setUsers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        api.getAllScores().then((data) => setScores(data));
        api.getAllUsers().then((data) => setUsers(data));
        api.getAllSessions().then((data) => setSessions(data));
    }, []);

    useEffect(() => {
        if (selectedUser && selectedSession) {
            api.getSessionScores(selectedSession).then((sessionData) =>
                api.getUserScores(selectedUser).then((userData) => setScores(sessionData.filter(val => userData.includes(val)))));
        } else if (selectedUser) {
            api.getUserScores(selectedUser).then((data) => setScores(data));
        } else if (selectedSession) {
            api.getSessionScores(selectedSession).then((data) => setScores(data));
        } else {
            api.getAllScores().then((data) => setScores(data));
        }
        setPage(0);
    }, [selectedUser, selectedSession]);

    const filteredScores = scores.filter((score) => {
        if (!selectedMonth && !selectedYear) return true;
        const scoreDate = new Date(score.date);
        if (selectedMonth && scoreDate.getMonth() !== parseInt(selectedMonth)) return false;
        if (selectedYear && scoreDate.getFullYear() !== parseInt(selectedYear)) return false;
        return true;
    });

    const columns = [
        { id: 'user', label: 'User'},
        { id: 'session', label: 'Session'},
        { id: 'duration', label: 'Duration (Sec)'},
        { id: 'date', label: 'Date'}
    ];

    return (
        <div style={{ display: "flex", position: "absolute", height: "100%", width: "100%", alignContent:'center', justifyContent: "center", alignItems: "center" }}>
            <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">All Users</MenuItem>
                {users.map((user) => (
                    <MenuItem key={user.name} value={user.name}>
                        {user.name}
                    </MenuItem>
                ))}
            </Select>
            <Select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">All Sessions</MenuItem>
                {sessions.map((session) => (
                    <MenuItem key={session.name} value={session.name}>
                        {session.name}
                    </MenuItem>
                ))}
            </Select>
            <Paper sx={{ width: '100%' }}>
                <TableContainer component={Paper}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align="center"
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {scores && scores.map((score) => (
                                <TableRow key={score._id}>
                                    <TableCell align="center">{score.user}</TableCell>
                                    <TableCell align="center">{score.session}</TableCell>
                                    <TableCell align="center">{score.duration}</TableCell>
                                    <TableCell align="center">{new Date(score.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                            )).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={scores.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">All Years</MenuItem>
                {[...new Set(scores.map((score) => new Date(score.date).getFullYear()))].map(
                    (year) => (
                        <MenuItem key={year} value={year}>
                            {year}
                        </MenuItem>
                    )
                )}
            </Select>

            <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                displayEmpty
            >
                <MenuItem value="">All Months</MenuItem>
                {Array.from({ length: 12 }, (_, i) => (
                    <MenuItem key={i} value={i}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                    </MenuItem>
                ))}
            </Select>

            <LineChart width={500} height={300} data={filteredScores}>
                <XAxis dataKey="date"
                       tickFormatter={(date) => new Date(date).toLocaleDateString()}/>
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" fill='green'/>
                <Tooltip />
                <Line type="monotone" dataKey="duration" stroke="#8884d8" />
            </LineChart>
        </div>
    );
};
// import React from 'react';
// import {useContext, useState, useEffect} from "react";
// import api from "../util/api";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
//
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );
//
// const options = {
//   responsive: true,
//   interaction: {
//     mode: 'index',
//     intersect: false,
//   },
//   stacked: false,
//   plugins: {
//     title: {
//       display: true,
//       text: 'Chart.js Line Chart - Multi Axis',
//     },
//   },
//   scales: {
//     y: {
//       type: 'linear',
//       display: true,
//       position: 'left',
//     },
//     y1: {
//       type: 'linear',
//       display: true,
//       position: 'right',
//       grid: {
//         drawOnChartArea: false,
//       },
//     },
//   },
// };
//
//
//
//
//
// export default function ScorePage(myUser) {
//     const [userScores,setUserScores] = useState(null)
//     const [labels, setLabels] = useState(null)
//     const [data, setData] = useState(null)
//
//     async function getUserScores() {
//         const response = await api.getUserScores(myUser)
//         if (response.error) {
//             return
//         }
//         const sets = response.map((score) => {return {
//             label: score.session,
//             data: labels.map(() => 5),
//             borderColor: 'rgb(255, 99, 132)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             yAxisID: score.session,
//         }})
//         setData({
//             labels,
//             datasets: [...sets]
//           })
//         setUserScores(response)
//     }
//
//     function generateLables() {
//         const today = Date.today()
//         const month = today.getMonth()
//         const year = today.getYear()
//         const daysInMonth = Date.getDaysInMonth(year, month)
//         setLabels(daysInMonth)
//     }
//
//     useEffect(() => {
//         async function load() {
//             generateLables()
//             getUserScores()
//         }
//         load()
//     }, [])
//
//
//   return(
//     <div style={{ position: 'absolute', width: '100%', height: '70%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop:60}}>
//         <Line options={options} data={data} />;
//     </div>
//   )
//
// }
