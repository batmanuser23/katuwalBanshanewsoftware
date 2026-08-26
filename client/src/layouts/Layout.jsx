// // // src/layouts/Layout.jsx
// // import { useState } from 'react';
// // import Sidebar from '../components/Sidebar';
// // import Header from '../components/Header';
// // import Footer from '../components/Footer';

// // const Layout = ({ children }) => {
// //   const [sidebarOpen, setSidebarOpen] = useState(true);

// //   return (
// //     <div className="flex h-screen bg-gray-50">
// //       <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
// //         <main className="flex-1 overflow-y-auto p-6">
// //           {children}
// //         </main>
// //         <Footer />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Layout;

// import { useState } from "react";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/Header";
// import Footer from "../components/Footer";

// export default function Layout({ children }) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* Sidebar */}
//       <Sidebar
//         isOpen={sidebarOpen}
//         toggle={() => setSidebarOpen(false)}
//       />

//       {/* Right Side */}
//       <div className="lg:ml-72 flex flex-col min-h-screen transition-all duration-300">

//         <Header
//           toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//         />

//         <main className="flex-1 p-6 lg:p-8 mt-16">
//           {children}
//         </main>

//         <Footer />

//       </div>
//     </div>
//   );
// }

// src/layouts/Layout.jsx
// import React, { useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import Header from '../components/Header';
// import Footer from '../components/Footer';
// import { useTheme } from '../context/ThemeContext';
// import { useLanguage } from '../context/LanguageContext';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const { isDark } = useTheme();
//   const { t } = useLanguage();

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const closeSidebar = () => {
//     setSidebarOpen(false);
//   };

//   return (
//     <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
//       <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
//         {/* Sidebar with close handler */}
//         <Sidebar 
//           isOpen={sidebarOpen} 
//           toggle={closeSidebar} 
//         />
        
//         {/* Main content area */}
//         <div className="flex-1 flex flex-col overflow-hidden lg:ml-72 transition-all duration-300">
//           {/* Header with toggle handler */}
//           <Header 
//             toggleSidebar={toggleSidebar} 
//           />
          
//           {/* Main content */}
//           <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 mt-16">
//             <div className="max-w-7xl mx-auto">
//               {children}
//             </div>
//           </main>
          
//           {/* Footer */}
//           <Footer />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

// src/layouts/Layout.jsx - WITHOUT THEME
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        toggle={closeSidebar}
      />

      {/* Right Side */}
      <div className="lg:ml-72 flex flex-col min-h-screen transition-all duration-300">
        <Header
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 mt-16">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;