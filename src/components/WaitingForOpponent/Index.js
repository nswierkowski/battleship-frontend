import { TailSpin } from "react-loader-spinner";
import "./WaitingForOpponent.css"

function WaitingForOpponent() {

    return <div className="waiting-room-page"
    >
        <h1 className="header-container">
            Waiting for opponent...
        </h1>
        <div>
            <TailSpin
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
                visible={true}
            />
        </div>
    </div>;
}

export default WaitingForOpponent;    