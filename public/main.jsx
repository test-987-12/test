
if (!document.getElementById('loading-overlay')) document.body.appendChild(Object.assign(document.createElement('div'), { id: 'loading-overlay' })).style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:#222222;color:#ffffff;display:flex;align-items:center;justify-content:center;z-index:999999;";
document.getElementById('loading-overlay').textContent = "Loading React...";
document.getElementById('loading-overlay').style.display = 'none';

; (async () => {
    if (window.initOnce) return;
    window.initOnce = true;
    // document.getElementById('loading-overlay').textContent = "Loading Tailwind CSS...";
    // await window.utils.evalScript(await (await fetch('https://unpkg.com/@tailwindcss/browser@4')).text());
    // document.getElementById('loading-overlay').textContent = "Loading Eruda...";
    // window.utils.evalScript(await (await fetch('https://cdn.jsdelivr.net/npm/eruda')).text()).then(() => window.eruda.init())
})();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { proxy, ref } from 'valtio';
import { useProxy } from 'valtio/utils';
import { Button, ThemeProvider, createTheme, Box, AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getStorage } from 'firebase/storage';
import * as Icons from '@mui/icons-material';

const { default: Home } = await utils.dynamicImport('Home.jsx');
const { default: NotificationSettings } = await utils.dynamicImport('NotificationSettings.jsx');

let serviceAccountFirebase = {
    apiKey: "AIzaSyCWzeya7dZmsE7XkQvOECKEXXarsMKgmH4",
    authDomain: "test-firebase-987-12.firebaseapp.com",
    projectId: "test-firebase-987-12",
    storageBucket: "test-firebase-987-12.firebasestorage.app",
    messagingSenderId: "103938328487",
    appId: "1:103938328487:web:4981246a266858253d1882",
    measurementId: "G-7DM0BMGDZD"
};


window.state = proxy({});

window.fetchRoutine = (async () => {

    const apiKey = "AIzaSyC-Ix2xopfJqdj74UE7zCVY1mr63B9p2lE";
    const spreadsheetId = "1VIteFcuXzX1FwjnY08QiLS40o7-oHZ50xAzbo-8Dk7c";
    const range = "Sheet1";
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}&valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=SERIAL_NUMBER&_=${Date.now()}`;
    const sheetData = await (await fetch(sheetUrl)).json();
    const { modifiedTime } = await (await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?fields=modifiedTime&key=${apiKey}`)).json();

    state.spreadsheetId = spreadsheetId;
    state.sheetData = sheetData;
    state.modifiedTime = modifiedTime;

});

window.fetchRoutine();


onMessage(getMessaging(initializeApp(serviceAccountFirebase)), (payload) => {
    console.log('Message received. ', payload);
    utils.notify(payload.notification.title, payload.notification.body);
    window.fetchRoutine();
});


function App() {
    const proxyState = useProxy(state);

    return (
        <div className={`h-[${window.innerHeight}px] flex flex-col w-full`} >
            <Router>
                <div className="z-10 !shadow-[0_2px_4px_rgba(0,0,0,0.1)] shrink-0 w-full max-w-4xl md:max-w-full mx-auto sticky top-0" >
                    {proxyState.appBar || (
                        <div className="bg-blue-600 px-6 py-4">
                            <div className="w-full max-w-4xl mx-auto">
                                <Typography variant="h5" className="text-white font-medium">
                                    Automated Class Routine
                                </Typography>
                                <Typography variant="body2" className="text-blue-100 mt-1">
                                    Powered by <a href="https://www.google.com" className="text-white hover:underline">Google Sheets</a>
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`w-full grow flex flex-col overflow-auto relative `}>
                    <div className={`w-full grow flex flex-col max-w-4xl mx-auto `}>
                        {/* App Bar */}

                        <div className="flex grow overflow-auto w-full">
                            {/* Desktop Left Sidenav */}
                            <div className='hidden md:block  w-64 shrink-0'>
                                <div className='hidden md:block shrink-0 border-r border-gray-200 fixed w-64 h-full'>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton component={Link} to="/">
                                                <ListItemIcon>
                                                    <Icons.Home />
                                                </ListItemIcon>
                                                <ListItemText primary="Home" />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemButton component={Link} to="/notifications">
                                                <ListItemIcon>
                                                    <Icons.Notifications />
                                                </ListItemIcon>
                                                <ListItemText primary="Notifications" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </div>
                            </div>

                            {/* Routes */}
                            <main className="container h-full overflow-auto mx-auto">
                                <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/notifications" element={<NotificationSettings />} />
                                </Routes>
                            </main>
                        </div>

                        {/* Mobile Bottom Nav */}
                    </div>
                </div>
                <BottomNavigation
                    className="z-10 sticky bottom-0 !shrink-0 !shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:!hidden"
                    showLabels
                >
                    <BottomNavigationAction component={Link} to="/" label="Home" icon={<Icons.Home />} />
                    <BottomNavigationAction component={Link} to="/notifications" label="Notifications" icon={<Icons.Notifications />} />
                </BottomNavigation>
            </Router>
        </div>
    );
}


class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null, errorInfo: null, remaining: 5000 };
    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true, error, errorInfo, remaining: 5000 }, () => { });
    }
    render() {
        const { hasError, error, errorInfo, remaining } = this.state;
        return hasError ? React.createElement("div", { className: "text-xs full border border-red-500 bg-black text-white p-2 break-words w-screen dark:bg-gray-800 dark:text-gray-200" },
            React.createElement("div", { className: "font-mono" }, "Retrying in ", remaining, "ms"),
            React.createElement("pre", { className: "whitespace-no-wrap overflow-x-scroll" },
                React.createElement("div", { className: "text-red-500 text-lg font-bold" }, error?.toString() || "Unknown Error"),
                React.createElement("div", { className: "" }, errorInfo?.componentStack.split("\\n").slice(0, 5).join("\\n") || "Stack finding error")
            )
        ) : this.props.children;
    }
}



window.render = function render() {
    if (!window.rootEl) window.rootEl = createRoot(document.getElementById('root'));
    window.rootEl.render(
        window.location.protocol == 'http:' && <ErrorBoundary>
            <App />
        </ErrorBoundary> || <App />
    );
}

render();