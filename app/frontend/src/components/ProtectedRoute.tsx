import { Navigate, Outlet } from "react-router-dom";

interface Props {
    isAllowed: boolean;
    children?: React.ReactNode;
}


export const ProtectedRoute: React.FC<Props> = ({isAllowed, children}: Props) => {
    if(!isAllowed)  return <Navigate to="/" />

    return children ? <>{children}</> : <Outlet/>
}