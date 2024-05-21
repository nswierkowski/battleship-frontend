import React, { useState } from 'react';
import './Board.css'; 
import './BoardField'
import BoardField from './BoardField';

function BoardRow({row}) {
    return <>
        {row.map((cell, colIndex) => 
             <BoardField key={colIndex} cell={cell} colIndex={colIndex + 1}/>
            )
        } 
    </>
}


export default BoardRow;
