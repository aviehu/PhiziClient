import React, { useState, useEffect } from 'react';
import api from "../util/api";

const ScoreTable = () => {
    const [scores, setScores] = useState([]);
    const [viewBy, setViewBy] = useState('session');
    const [sessions, setSessions] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [selectedUser, setSelectedUser] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            let result;
            if (viewBy === 'session') {
                result = await api.getSessionScores(selectedSession);
            } else {
                result = await api.getUserScores(selectedUser);
            }
            setScores(result.data);
        };
        fetchData();
    }, [viewBy, selectedSession, selectedUser]);

    useEffect(() => {
        const fetchSessions = async () => {
            const result = await api.getAllSessions()
            setSessions(result.data);
        };
        fetchSessions();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await api.getAllUsers()
            setUsers(result.data);
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 50 }}>
            <h1>Scores</h1>
            <select value={viewBy} onChange={e => setViewBy(e.target.value)}>
                <option value="session">View by session</option>
                <option value="user">View by user</option>
            </select>
            {viewBy === 'session' ? (
                <>
                    <select value={selectedSession} onChange={e => setSelectedSession(e.target.value)}>
                        {sessions.map(session => (
                            <option key={session} value={session}>
                                {session}
                            </option>
                        ))}
                    </select>
                    <table>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Duration</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scores.map(score => (
                            <tr key={score._id}>
                                <td>{score.user}</td>
                                <td>{score.duration}</td>
                                <td>{new Date(score.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                        {users.map(user => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                    <table>
                        <thead>
                        <tr>
                            <th>Session</th>
                            <th>Duration</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {scores.map(score => (
                            <tr key={score._id}>
                                <td>{score.session}</td>
                                <td>{score.duration}</td>
                                <td>{new Date(score.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ScoreTable;