import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '@/shared/components/Navbar';
import Footer from '@/shared/components/Footer';
import RouteTitle from '@/shared/components/RouteTitle';

const RootLayout = () => {
    return (
        <div>
            <RouteTitle />
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;
