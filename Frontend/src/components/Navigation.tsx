import { FileText, Lock, User } from "lucide-react";

const Navigation: React.FC<{
  activeSection: string;
  onSectionChange: (section: string) => void;
}> = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'articles', label: 'My Articles', icon: FileText },
    { id: 'password', label: 'Change Password', icon: Lock }
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 pt-8">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>
      <ul className="space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation