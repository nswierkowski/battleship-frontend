import React, { useState } from 'react';
import './Board.css'; 

function BoardField({cell, colIndex}) {
    return <td
            key={colIndex}
            className='table-field'
        >
            {cell}
        </td>
}


export default BoardField;