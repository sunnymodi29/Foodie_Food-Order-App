import Sidebar from '../Sidebar/Sidebar';
import '../AdminLayout/AdminLayout.css';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
