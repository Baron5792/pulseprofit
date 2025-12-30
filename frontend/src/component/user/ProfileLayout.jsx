    import { Outlet } from "react-router";
import { ProfileHeader } from "./partials/ProfileHeader";

    const ProfileLayout = () => {
        return (
            <>
                <ProfileHeader />
                <Outlet />
            </>
        )
    }

    export default ProfileLayout;