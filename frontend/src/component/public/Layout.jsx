import { PublicFooter } from "./partials/Footer";
import PublicHeader from "./partials/Header";
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
    return (
        <>
            <nav>
                <PublicHeader />
            </nav>
            <main>
                <Outlet />
            </main>
            <footer>
                <PublicFooter />
            </footer>
        </>
    )
}

export default PublicLayout;