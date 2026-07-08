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
        handle: { title: "Home" },
        children: [
            {
                index: true,
                Component: Home,
                handle: { title: "Home" }
            },
            {
                path: "coverage",
                Component: Coverage,
                handle: { title: "Coverage" }
            },
            {
                path: "pricing",
                Component: PricingCalculator,
                handle: { title: "Pricing" }
            },
            {
                path: "about",
                Component: AboutUs,
                handle: { title: "About Us" }
            },
            {
                path: "rider",
                element: <PrivateRoute><BeARider /></PrivateRoute>,
                handle: { title: "Become a Rider" }
            },
            {
                path: "add-parcel",
                element: <PrivateRoute><AddParcel /></PrivateRoute>,
                handle: { title: "Add Parcel" }
            }
        ]
    },
    {
        path: "dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        handle: { title: "Dashboard" },
        children: [
            // Default index — resolved dynamically by DashboardLayout based on role
            // Admin lands on AdminStatistics, User lands on MyParcels
            {
                index: true,
                element: <DashboardIndex />,
                handle: { title: "Dashboard" }
            },
            {
                path: "profile",
                element: <MyProfile />,
                handle: { title: "My Profile" }
            },
            {
                path: "payment/:id",
                element: <Payment />,
                handle: { title: "Payment" }
            },
            {
                path: "payment-history",
                element: <PaymentHistory />,
                handle: { title: "Payment History" }
            },
            {
                path: "balance",
                element: <Balance />,
                handle: { title: "My Balance" }
            },
            {
                path: "view/:id",
                element: <ViewParcel />,
                handle: { title: "View Parcel" }
            },
            {
                path: "track",
                element: <Trackparcel />,
                handle: { title: "Track Parcel" }
            },
            {
                path: "rider-overview",
                element: <RiderOverview />,
                handle: { title: "Rider Overview" }
            },
            {
                path: "delivery-list",
                element: <RiderDeliveryList />,
                handle: { title: "Delivery List" }
            },
            {
                path: "ongoing-tasks",
                element: <RiderOngoingTasks />,
                handle: { title: "Ongoing Tasks" }
            },
            {
                path: "completed",
                element: <RiderCompleted />,
                handle: { title: "Completed Deliveries" }
            },
            {
                path: "earnings",
                element: <RiderEarnings />,
                handle: { title: "Rider Earnings" }
            },
            {
                path: "my-reviews",
                element: <RiderMyReviews />,
                handle: { title: "My Reviews" }
            },

            // ===== ADMIN-ONLY ROUTES =====
            {
                path: "statistics",
                element: <AdminRoute><AdminStatistics /></AdminRoute>,
                handle: { title: "Admin Statistics" }
            },
            {
                path: "all-parcels",
                element: <AdminRoute><AllParcels /></AdminRoute>,
                handle: { title: "All Parcels" }
            },
            {
                path: "assign-parcels",
                element: <AdminRoute><AssignParcels /></AdminRoute>,
                handle: { title: "Assign Parcels" }
            },
            {
                path: "payment-logs",
                element: <AdminRoute><AdminPaymentLogs /></AdminRoute>,
                handle: { title: "Payment Logs" }
            },
            {
                path: "manage-riders",
                element: <AdminRoute><ManageRiders /></AdminRoute>,
                handle: { title: "Manage Riders" }
            },
            {
                path: "rider-reviews",
                element: <AdminRoute><RiderReviews /></AdminRoute>,
                handle: { title: "Rider Reviews" }
            },
            // Legacy routes (still protected)
            {
                path: "pending-rider",
                element: <AdminRoute><PendingRider /></AdminRoute>,
                handle: { title: "Pending Riders" }
            },
            {
                path: "active-rider",
                element: <AdminRoute><ActiveRider /></AdminRoute>,
                handle: { title: "Active Riders" }
            },
            {
                path: "manage-users",
                element: <AdminRoute><ManageUsers /></AdminRoute>,
                handle: { title: "Manage Users" }
            }
        ]
    },
    {
        path: "/",
        Component: AuthLayout,
        handle: { title: "Authentication" },
        children: [
            {
                path: "login",
                Component: Login,
                handle: { title: "Login" }
            },
            {
                path: "register",
                Component: Register,
                handle: { title: "Register" }
            }
        ]
    },
    {
        path: "*",
        Component: ErrorPage,
        handle: { title: "Page Not Found" }
    }
]);
