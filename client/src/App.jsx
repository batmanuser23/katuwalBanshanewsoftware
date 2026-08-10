// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { SocketProvider } from './context/SocketContext';
// import Layout from './layouts/Layout';
// import Dashboard from './pages/Dashboard';
// import Members from './pages/Members';
// import Families from './pages/Families';
// import Donations from './pages/Donations';
// import FamilyTree from './pages/FamilyTree';
// import Documents from './pages/Documents';
// import Chat from './pages/Chat';
// import Notifications from './pages/Notifications';
// import Reports from './pages/Reports';
// import Settings from './pages/Settings';
// import Backups from './pages/Backups';

// // Create React Query client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//       staleTime: 5 * 60 * 1000, // 5 minutes
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <SocketProvider>
//         <Router>
//           <Layout>
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/members" element={<Members />} />
//               <Route path="/families" element={<Families />} />
//               <Route path="/donations" element={<Donations />} />
//               <Route path="/family-tree" element={<FamilyTree />} />
//               <Route path="/documents" element={<Documents />} />
//               <Route path="/chat" element={<Chat />} />
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/reports" element={<Reports />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/backups" element={<Backups />} />
//             </Routes>
//           </Layout>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 3000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//             }}
//           />
//         </Router>
//       </SocketProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

// // src/App.jsx
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { Toaster } from 'react-hot-toast';
// import { SocketProvider } from './context/SocketContext';
// import Layout from './layouts/Layout';
// import Dashboard from './pages/Dashboard';
// import Members from './pages/Members';
// import Families from './pages/Families';
// import Donations from './pages/Donations';
// import FamilyTree from './pages/FamilyTreePage';
// import DataEntry from './pages/DataEntry';
// // import MemberProfile from './pages/MemberProfile';
// import Documents from './pages/Documents';
// import Chat from './pages/Chat';
// import Notifications from './pages/Notifications';
// import Reports from './pages/Reports';
// import Settings from './pages/Settings';
// import Backups from './pages/Backups';

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: false,
//       retry: 1,
//       staleTime: 5 * 60 * 1000,
//     },
//   },
// });

// function App() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <SocketProvider>
//         <Router>
//           <Layout>
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/members" element={<Members />} />
//               {/* <Route path="/members/:id" element={<MemberProfile />} /> */}
//               <Route path="/families" element={<Families />} />
//               <Route path="/donations" element={<Donations />} />
//               <Route path="/family-tree" element={<FamilyTree />} />
//               <Route path="/data-entry" element={<DataEntry />} />
//               <Route path="/data-entry/:id" element={<DataEntry />} />
//               <Route path="/documents" element={<Documents />} />
//               <Route path="/chat" element={<Chat />} />
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/reports" element={<Reports />} />
//               <Route path="/settings" element={<Settings />} />
//               <Route path="/backups" element={<Backups />} />
//             </Routes>
//           </Layout>
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 3000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//             }}
//           />
//         </Router>
//       </SocketProvider>
//     </QueryClientProvider>
//   );
// }

// export default App;

// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Families from './pages/Families';
import Donations from './pages/Donations';
import FamilyTree from './pages/FamilyTreePage';
import DataEntry from './pages/DataEntry';
// import MemberProfile from './pages/MemberProfile';
import Documents from './pages/Documents';
import Chat from './pages/Chat';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Backups from './pages/Backups';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              {/* <Route path="/members/:id" element={<MemberProfile />} /> */}
              <Route path="/families" element={<Families />} />
              <Route path="/donations" element={<Donations />} />
              <Route path="/family-tree" element={<FamilyTree />} />
              <Route path="/data-entry" element={<DataEntry />} />
              <Route path="/data-entry/:id" element={<DataEntry />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/backups" element={<Backups />} />
            </Routes>
          </Layout>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;