// // src/components/Sidebar.jsx
// import { NavLink } from 'react-router-dom';
// import {
//   HomeIcon,
//   UsersIcon,
//   BuildingOfficeIcon,
//   HeartIcon,
//   GitBranch,
//   DocumentIcon,
//   ChatBubbleLeftIcon,
//   BellIcon,
//   ChartBarIcon,
//   CogIcon,
//   ArchiveBoxIcon,
// } from '@heroicons/react/24/outline';

// const navigation = [
//   { name: 'Dashboard', href: '/', icon: HomeIcon },
//   { name: 'Members', href: '/members', icon: UsersIcon },
//   { name: 'Families', href: '/families', icon: BuildingOfficeIcon },
//   { name: 'Donations', href: '/donations', icon: HeartIcon },
//   { name: 'Family Tree', href: '/family-tree', icon: GitBranch },
//   { name: 'Documents', href: '/documents', icon: DocumentIcon },
//   { name: 'Chat', href: '/chat', icon: ChatBubbleLeftIcon },
//   { name: 'Notifications', href: '/notifications', icon: BellIcon },
//   { name: 'Reports', href: '/reports', icon: ChartBarIcon },
//   { name: 'Backups', href: '/backups', icon: ArchiveBoxIcon },
//   { name: 'Settings', href: '/settings', icon: CogIcon },
// ];

// const Sidebar = ({ isOpen, toggle }) => {
//   return (
//     <>
//       {/* Mobile overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
//           onClick={toggle}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Logo */}
//           <div className="flex items-center h-16 px-6 border-b border-gray-200">
//             <GitBranch className="h-8 w-8 text-primary" />
//             <span className="ml-2 text-xl font-bold text-gray-800">
//               Family Tree
//             </span>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-4 overflow-y-auto">
//             <ul className="space-y-1">
//               {navigation.map((item) => (
//                 <li key={item.name}>
//                   <NavLink
//                     to={item.href}
//                     className={({ isActive }) =>
//                       `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
//                         isActive
//                           ? 'bg-primary text-white'
//                           : 'text-gray-700 hover:bg-gray-100'
//                       }`
//                     }
//                   >
//                     <item.icon className="h-5 w-5 mr-3" />
//                     {item.name}
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Footer */}
//           <div className="p-4 border-t border-gray-200">
//             <p className="text-xs text-gray-500 text-center">
//               © 2026 Family Tree System
//             </p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import { NavLink } from "react-router-dom";
import {
  XMarkIcon,
  Squares2X2Icon,
  UsersIcon,
  // BuildingOffice2Icon,
  HeartIcon,
  // Shareicon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ChartBarSquareIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import {
  GitBranch,
  UserPlus,
  // Network,
  // Waypoints,
  // Workflow,
  // Share2,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Squares2X2Icon,
  },
  {
    name: "Members",
    href: "/members",
    icon: UsersIcon,
  },
  {
    name: "DataEntry",
    href: "/data-entry",
    icon: UserPlus,
  },
  {
    name: "Donations",
    href: "/donations",
    icon: HeartIcon,
  },
   {
    name: "Families",
    href: "/families",
    icon: GitBranch,
  },
  {
    name: "Family Tree",
    href: "/family-tree",
    icon: GitBranch,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: DocumentTextIcon,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartBarSquareIcon,
  },
  {
    name: "Backups",
    href: "/backups",
    icon: ArchiveBoxIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
  },
];

export default function Sidebar({ isOpen, toggle }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggle}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">

          {/* Logo */}
          <div className="h-16 border-b border-slate-200 flex items-center justify-between px-6">

            <div className="flex items-center gap-3">

              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">

                <GitBranch className="h-6 w-6 text-white" />

              </div>

              <div>

                <h1 className="font-bold text-lg text-slate-800">
                  Katuwal Bansha
                </h1>

                <p className="text-xs text-slate-500">
                  Management System
                </p>

              </div>

            </div>

            <button
              onClick={toggle}
              className="lg:hidden rounded-lg p-2 hover:bg-slate-100"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">

            <ul className="space-y-2">

              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    end={item.href === "/"}
                    className={({ isActive }) =>
                      `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200
                      ${
                        isActive
                          ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white shadow-lg"
                          : "text-slate-700 hover:bg-slate-100 hover:text-green-600"
                      }`
                    }
                  >
                    <item.icon className="h-6 w-6 flex-shrink-0" />

                    <span className="font-medium">
                      {item.name}
                    </span>
                  </NavLink>
                </li>
              ))}

            </ul>

          </nav>

          {/* Bottom Card */}
          <div className="p-5 border-t border-slate-200">

            <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 p-4 text-white shadow-lg">

              <h3 className="font-semibold">
                Katuwal Bansha Batika is Family Tree System
              </h3>

              <p className="text-sm mt-1 text-green-100">
                Modern Digital Genealogy Platform
              </p>

            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              © 2026 NDS Software
            </p>

          </div>

        </div>
      </aside>
    </>
  );
}