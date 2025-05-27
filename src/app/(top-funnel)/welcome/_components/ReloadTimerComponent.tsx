import { ReloadIcon } from "@radix-ui/react-icons";
import { FC, useEffect, useState } from "react";

interface ReloadTimerComponentProps {
    reloadTime: number;
    onReload: () => void;
}

const ReloadTimerComponent: FC<ReloadTimerComponentProps> = ({ reloadTime, onReload }) => {

    const [timeLeft, setTimeLeft] = useState(reloadTime);
    const _getMMSS = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const _handleOnReload = () => {
        if (timeLeft > 0) return;
        onReload();
    }


    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeLeft(0);
        } else {
            const timer = setTimeout(() => {
                const timerCounter = timeLeft - 1;
                if (timerCounter <= 0) {
                    setTimeLeft(0);
                    clearTimeout(timer);
                } else {
                    setTimeLeft(timerCounter);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, onReload]);

    return (
        <div className={`flex items-center justify-center ${timeLeft > 0 ? 'cursor-not-allowed opacity-[.4]' : 'cursor-pointer text-[#0B74C0]'}`} onClick={_handleOnReload}>
            <ReloadIcon className='size-4 me-2' /> {timeLeft > 0 ? _getMMSS(timeLeft) : "Resend"}
        </div>
    );
}
export default ReloadTimerComponent;

