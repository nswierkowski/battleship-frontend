import React from 'react';
import '../PlayersBoard.css';
import CellCategor from '../CellCategories';

function OpponentBoardField({cell, colIndex, rowIndex}) {

    return (
        <td className={cell===CellCategor.SHIP ? `table-field ship` : 'table-field'}>
            {null}
        </td>
    );
}

export default OpponentBoardField;
