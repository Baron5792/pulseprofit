import { Outlet } from "react-router";
import { UserHeader } from "./partials/UserHeader";
import { PublicFooter } from "../public/partials/Footer";

const UserLayout = () => {
    return (
        <>
            <header>
                <UserHeader />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <PublicFooter />
            </footer>
        </>
    )
}

export default UserLayout;