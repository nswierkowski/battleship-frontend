import React from 'react';
import '../PlayersBoard.css';
import CellCategor from '../CellCategories';

function PlayerBoardField({cell, colIndex, rowIndex, result}) {
/*
    return (
        <td className={cell===CellCategor.SHIP ? `table-field ship` : 'table-field'}>
            {null}
        </td>
    );*/

    const getCellType = () => {
        let cellClass = cell===CellCategor.SHIP ? `table-field ship` : 'table-field';
        if(result===true){
            cellClass="hit-ship-field";
        }
        return cellClass;
    }

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
        <td className={getCellType()} >
            <div className={getClassName()}>{result ? 'X':''}</div>
        </td>
    );
}

export default PlayerBoardField;
