import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/app/layouts/AuthLayout";
import DashboardLayout from "@/app/layouts/DashboardLayout";
import RootLayout from "@/app/layouts/RootLayout";
import AddParcel from "@/features/parcels/pages/AddParcel";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import BeARider from "@/features/rider/pages/BeARider";
import ActiveRider from "@/features/dashboard/pages/ActiveRider";
import AdminStatistics from "@/features/dashboard/pages/AdminStatistics";
import AllParcels from "@/features/dashboard/pages/AllParcels";
import AssignParcels from "@/features/dashboard/pages/AssignParcels";
import Balance from "@/features/dashboard/pages/Balance";
import DashboardIndex from "@/features/dashboard/pages/DashboardIndex";
import ManageUsers from "@/features/dashboard/pages/ManageUsers";
import ManageRiders from "@/features/dashboard/pages/ManageRiders";
import AdminPaymentLogs from "@/features/dashboard/pages/AdminPaymentLogs";
import MyProfile from "@/features/dashboard/pages/MyProfile";
import Payment from "@/features/dashboard/pages/Payment/Payment";
import PaymentHistory from "@/features/dashboard/pages/Payment/PaymentHistory";
import PendingRider from "@/features/dashboard/pages/PendingRider";
import RiderCompleted from "@/features/dashboard/pages/RiderCompleted";
import RiderDeliveryList from "@/features/dashboard/pages/RiderDeliveryList";
import RiderEarnings from "@/features/dashboard/pages/RiderEarnings";
import RiderMyReviews from "@/features/dashboard/pages/RiderMyReviews";
import RiderOverview from "@/features/dashboard/pages/RiderOverview";
import RiderOngoingTasks from "@/features/dashboard/pages/RiderOngoingTasks";
import RiderReviews from "@/features/dashboard/pages/RiderReviews";
import Trackparcel from "@/features/dashboard/pages/Trackparcel";
import ViewParcel from "@/features/dashboard/pages/ViewParcel";
import ErrorPage from "@/features/error/pages/ErrorPage";
import AboutUs from "@/features/home/components/AboutUs";
import Coverage from "@/features/home/components/Coverage";
import Home from "@/features/home/pages/Home";
import PricingCalculator from "@/features/home/components/PricingCalculator";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";

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
        element: <DashboardLayout />,
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
