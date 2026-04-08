import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RootLayout from "../layouts/RootLayout";
import AddParcel from "../pages/AddParcel/AddParcel";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import BeARider from "../pages/BeARider/BeARider";
import ActiveRider from "../pages/Dashboard/ActiveRider/ActiveRider";
import AdminStatistics from "../pages/Dashboard/AdminStatistics/AdminStatistics";
import AllParcels from "../pages/Dashboard/AllParcels/AllParcels";
import AssignParcels from "../pages/Dashboard/AssignParcels/AssignParcels";
import Balance from "../pages/Dashboard/Balance/Balance";
import DashboardIndex from "../pages/Dashboard/DashboardIndex";
import ManageUsers from "../pages/Dashboard/ManageUsers/ManageUsers";
import ManageRiders from "../pages/Dashboard/ManageRiders/ManageRiders";
import AdminPaymentLogs from "../pages/Dashboard/AdminPaymentLogs/AdminPaymentLogs";
import MyProfile from "../pages/Dashboard/MyProfile/MyProfile";
import Payment from "../pages/Dashboard/Payment/Payment";
import PaymentHistory from "../pages/Dashboard/Payment/PaymentHistory";
import PendingRider from "../pages/Dashboard/PendingRider/PendingRider";
import RiderCompleted from "../pages/Dashboard/RiderCompleted/RiderCompleted";
import RiderDeliveryList from "../pages/Dashboard/RiderDeliveryList/RiderDeliveryList";
import RiderEarnings from "../pages/Dashboard/RiderEarnings/RiderEarnings";
import RiderMyReviews from "../pages/Dashboard/RiderMyReviews/RiderMyReviews";
import RiderOverview from "../pages/Dashboard/RiderOverview/RiderOverview";
import RiderOngoingTasks from "../pages/Dashboard/RiderOngoingTasks/RiderOngoingTasks";
import RiderReviews from "../pages/Dashboard/RiderReviews/RiderReviews";
import Trackparcel from "../pages/Dashboard/Trackparcel/Trackparcel";
import ViewParcel from "../pages/Dashboard/ViewParcel/ViewParcel";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import AboutUs from "../pages/Home/AboutUs/AboutUs";
import Coverage from "../pages/Home/Coverage/Coverage";
import Home from "../pages/Home/Home";
import PricingCalculator from "../pages/Home/PricingCalculator/PricingCalculator";
import AdminRoute from "../Routes/AdminRoute";
import PrivateRoute from "../Routes/PrivateRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children: [
            {
                index: true,
                Component: Home
            },
            {
                path: "coverage",
                Component: Coverage
            },
            {
                path: "pricing",
                Component: PricingCalculator
            },
            {
                path: "about",
                Component: AboutUs
            },
            {
                path: "rider",
                element: <PrivateRoute><BeARider /></PrivateRoute>
            },
            {
                path: "add-parcel",
                element: <PrivateRoute><AddParcel /></PrivateRoute>
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        children: [
            // Default index — resolved dynamically by DashboardLayout based on role
            // Admin lands on AdminStatistics, User lands on MyParcels
            {
                index: true,
                element: <DashboardIndex />
            },
            {
                path: "profile",
                element: <MyProfile />
            },
            {
                path: "payment/:id",
                element: <Payment />
            },
            {
                path: "payment-history",
                element: <PaymentHistory />
            },
            {
                path: "balance",
                element: <Balance />
            },
            {
                path: "view/:id",
                element: <ViewParcel />
            },
            {
                path: "track",
                element: <Trackparcel />
            },
            {
                path: "rider-overview",
                element: <RiderOverview />
            },
            {
                path: "delivery-list",
                element: <RiderDeliveryList />
            },
            {
                path: "ongoing-tasks",
                element: <RiderOngoingTasks />
            },
            {
                path: "completed",
                element: <RiderCompleted />
            },
            {
                path: "earnings",
                element: <RiderEarnings />
            },
            {
                path: "my-reviews",
                element: <RiderMyReviews />
            },

            // ===== ADMIN-ONLY ROUTES =====
            {
                path: "statistics",
                element: <AdminRoute><AdminStatistics /></AdminRoute>
            },
            {
                path: "all-parcels",
                element: <AdminRoute><AllParcels /></AdminRoute>
            },
            {
                path: "assign-parcels",
                element: <AdminRoute><AssignParcels /></AdminRoute>
            },
            {
                path: "payment-logs",
                element: <AdminRoute><AdminPaymentLogs /></AdminRoute>
            },
            {
                path: "manage-riders",
                element: <AdminRoute><ManageRiders /></AdminRoute>
            },
            {
                path: "rider-reviews",
                element: <AdminRoute><RiderReviews /></AdminRoute>
            },
            // Legacy routes (still protected)
            {
                path: "pending-rider",
                element: <AdminRoute><PendingRider /></AdminRoute>
            },
            {
                path: "active-rider",
                element: <AdminRoute><ActiveRider /></AdminRoute>
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>
            }
        ]
    },
    {
        path: "/",
        Component: AuthLayout,
        children: [
            {
                path: "login",
                Component: Login
            },
            {
                path: "register",
                Component: Register
            }
        ]
    },
    {
        path: "*",
        Component: ErrorPage
    }
]);
