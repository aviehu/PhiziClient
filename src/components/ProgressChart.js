import React, { useContext,useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function ProgressChart({filteredScores}){
    return(
        <LineChart width={650} height={350} data={filteredScores}>
                    <XAxis dataKey="date"
                        stroke='rgba(255,255,255,0.8)'
                        tickFormatter={(date) => new Date(date).toLocaleDateString()}/>
                    <YAxis stroke='rgba(255,255,255,0.8)' />
                    <CartesianGrid strokeDasharray="3 3" stroke='rgba(255,255,255,0.9)' fill='rgba(255,255,255,0.7)'/>
                    <Tooltip wrapperStyle={{color: 'black'}} />
                    <Line type="monotone" dataKey="duration" stroke="#CB67D4" strokeWidth={3} dot={{ fill: '#FFFFFF', strokeWidth: 2 }} />
        </LineChart>
    )
}