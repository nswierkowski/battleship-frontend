import Ship from '../Ship/Index'
import './AvalaibleShips.css'
import PrefixShipSquare from './PrefixShipSquare';

function AvalaibleShips({shipsCount}) {
    const shipsLength = [2, 3, 4, 5]
    

    const handleOnDragStart = (e, widgetType) => {
        e.dataTransfer.setData("widgetType", widgetType);
        e.target.classList.add('dragging');
    };

    const handleOnDragEnd = (e) => {
        e.target.classList.remove('dragging');
    };


    return <table>
        <tbody>
            {shipsLength.map((shipLength, shipIndex) => 
                <tr key={shipIndex} className='avalaible-ship-row'>
                    <td>
                        <PrefixShipSquare key={"Ship-Count"} className='count-font' prefix={`${shipsCount[shipLength]}X`}/>
                    </td>
                    <td className='avalaible-ship-cell'
                        draggable={shipsCount[shipLength] > 0}
                        onDragStart={(e) => handleOnDragStart(e, shipLength)}
                        onDragEnd={handleOnDragEnd}
                    >
                        <Ship shipLength={shipLength}/>
                    </td>
                </tr>
            )}
        </tbody>
    </table>

}

export default AvalaibleShips