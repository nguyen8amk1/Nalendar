import { createBrowserRouter, createRoutesFromElements, RouterProvider, BrowserRouter, Routes, Route, Link, Outlet} from 'react-router-dom';
import './App.css';
import { AuthProvider } from './auth/AuthProvider';
import {Home} from './pages/Home'; 

import { GoogleOAuthProvider } from '@react-oauth/google';

import {createTheme} from '@mui/material/styles';
import {ThemeProvider} from '@emotion/react';
import GoogleCalendarGenerator from './pages/GoogleCalendarGenerator'; 

import SubmitYourTkbHTML from './components/SubmitYourTkbHTML'
import SubmitYourHocPhanInfo from './components/SubmitYourHocPhanInfo'
import GeneratedCalendar from './components/GeneratedCalendar'
import GeneratedLichThi from './components/GeneratedLichThi'
import { GoogleCalendarGeneratorProvider, useGoogleCalendarGeneratorContext } from './pages/GoogleCalendarGenerator'
import {PrivateRoute}  from './components/PrivateRoute';
import ThoiKhoaBieuTable from './components/ThoiKhoaBieuTable';


const theme = createTheme({
    // NOTE: any custom theme put here
}); 

// FIXME: do something with this mess, this is just a hack :v @Hacking
const router = createBrowserRouter(
    createRoutesFromElements(
        // TODO: create a layout that wraps around these, to have a uniform layout
        <Route path='/'>
            <Route path="gcg/*" element={ // Use wildcard to catch all nested routes under /gcg
                <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">
                    <AuthProvider>
                        <PrivateRoute>
                            <GoogleCalendarGeneratorProvider>
                                {/* <GoogleCalendarGenerator > */}
                                <Outlet /> {/* Render nested routes */}
                                {/* </GoogleCalendarGenerator > */}
                            </GoogleCalendarGeneratorProvider>
                        </PrivateRoute>
                    </AuthProvider>
                </GoogleOAuthProvider>
            }>
                <Route path="step1-html-upload" element={<SubmitYourTkbHTML />} />
                <Route path="step2-generate-calendar" element={<GeneratedCalendar />} />
            </Route>            

            <Route index element={
                <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">
                    <AuthProvider>
                        <Home/>
                    </AuthProvider>
                </GoogleOAuthProvider>
            }></Route>

        </Route>
    )
)

// const router = createBrowserRouter([
//     {
//         path:'/', 
//         element: 
//             <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">
//                 <AuthProvider>
//                     <Home/>
//                 </AuthProvider>
//             </GoogleOAuthProvider>, 
//         // errorElement:, 
//         children: [
//             {
//                 path: "gcg/step1-html-upload", 
//                 // errorElement:, 
//                 element: 
//                 <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">
//                     <AuthProvider>
//                         <PrivateRoute><SubmitYourTkbHTML/></PrivateRoute>
//                     </AuthProvider>
//                 </GoogleOAuthProvider>
//             }, 
//             {
//                 path: "gcg/step2-generate-calendar", 
//                 // errorElement:, 
//                 element: 
//                 <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">
//                     <AuthProvider>
//                         <PrivateRoute><GeneratedCalendar/></PrivateRoute>
//                     </AuthProvider>
//                 </GoogleOAuthProvider>
//             }, 
//         ], 
//     }, 
// ]);



function App() {
    const a = 
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
            {/* <GoogleOAuthProvider clientId="39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com">  */}
                {/* <AuthProvider> */}
                    {/* <RenderMenu />  */}
                    {/* <RenderRoutes /> */}
            {/*     </AuthProvider>  */}
            {/* </GoogleOAuthProvider> */}
        </ThemeProvider>

    const b = 
        <>
            <SubmitYourHocPhanInfo/>
            <GeneratedLichThi />
        </>

    return (
        a
        //b
    );
}

export default App;
