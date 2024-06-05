import React from 'react';
import '../PlayersBoard.css';
import CellCategor from '../CellCategories';


function OpponentBoardField({cell, colIndex, rowIndex, onClickAction, result}) {
    const getClassName = () => {
        if (result === null || result === undefined) {
            return '';
        } else if (result === false) {
            return 'hit-dot';
        } else if (result === true) {
            return 'hit-ship';
        }
    };
   

    return (
        <td className={result===true ? `hit-ship-field` : 'table-field'} onClick={onClickAction}>
            <div className={getClassName()}>{result ? 'X':''}</div>
        </td>
    );
}

export default OpponentBoardField;
