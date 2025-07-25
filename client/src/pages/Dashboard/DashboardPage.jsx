import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const DashboardPage = () => {
    const { logout } = useAuth();

    return (
        <div>
            <h1>Welcome to Dashboard!</h1>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default DashboardPage;
