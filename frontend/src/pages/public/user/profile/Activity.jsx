import { useEffect } from "react";

const Activity = () => {
    useEffect(() => {
        document.title = `Activity - ${import.meta.env.VITE_APP_NAME}`;
    })
    return (
        <>
            <div className="alert alert-info text-center my-3">
                <span className="small">No activity found</span>
            </div>

        </>
    )
}

export default Activity;