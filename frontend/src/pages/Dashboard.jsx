import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LogOut, Search, Grid, Box, DollarSign, PieChart, FileText, Settings, HelpCircle, Flag, Bell, MessageSquare, Menu } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get('https://web-backend-g900.onrender.com/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data. Are you sure backend is running?');
      } finally { setLoading(false); }
    }
    fetchData();
  }, [currentUser]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out');
    }
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  const NavItem = ({ icon: Icon, label, active, hasBadge }) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1.5rem', cursor: 'pointer', color: active ? 'white' : '#8b94a8', backgroundColor: active ? '#2b3446' : 'transparent', borderLeft: active ? '4px solid #3b82f6' : '4px solid transparent', marginBottom: '0.25rem' }}>
      <Icon size={18} style={{ marginRight: '1rem' }} />
      <span style={{ fontSize: '0.875rem', fontWeight: active ? '600' : '400', flex: 1 }}>{label}</span>
      {hasBadge && <span style={{ backgroundColor: '#ec4899', color: 'white', fontSize: '0.625rem', padding: '0.1rem 0.4rem', borderRadius: '9999px', fontWeight: 'bold' }}>3</span>}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar Overlay */}
      <div className={`overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}></div>
      
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Dashboard</span>
        </div>

        <div style={{ padding: '0 1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#2b3446', padding: '0.5rem 1rem', borderRadius: '8px' }}>
            <Search size={16} color="#8b94a8" />
            <input type="text" placeholder="Search anything" style={{ backgroundColor: 'transparent', border: 'none', color: 'white', outline: 'none', marginLeft: '0.75rem', fontSize: '0.875rem', width: '100%' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', color: '#8b94a8', fontWeight: '600', padding: '0 1.5rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>MAIN MENU</div>
          <NavItem icon={Grid} label="Dashboard" active={true} />
          <NavItem icon={Box} label="Products" />
          <NavItem icon={DollarSign} label="Earnings" />
          <NavItem icon={PieChart} label="Analytics" />
          <NavItem icon={FileText} label="Invoices" hasBadge={true} />
          
          <div style={{ fontSize: '0.7rem', color: '#8b94a8', fontWeight: '600', padding: '1.5rem 1.5rem 1rem 1.5rem', letterSpacing: '0.05em' }}>HELP & SUPPORT</div>
          <NavItem icon={Settings} label="Settings" />
          <NavItem icon={HelpCircle} label="Help & Center" />
          <NavItem icon={Flag} label="Report" />
        </div>

        <div style={{ padding: '1.5rem' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', color: '#8b94a8', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <LogOut size={18} style={{ marginRight: '1rem' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={24} color="#111827" />
            </button>
            <h1 className="header-title" style={{ margin: 0, fontSize: '1.25rem', color: '#111827', fontWeight: '700' }}>Welcome Back, {currentUser.email.split('@')[0]}! </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#e5e7eb', borderRadius: '50%', overflow: 'hidden' }}>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" style={{width: '100%', height:'100%'}}/>
            </div>
          </div>
        </div>

        {error && <div style={{ margin: '2rem 2rem 0', backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px' }}>{error}</div>}

        {data && (
          <div className="dashboard-content" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', boxSizing: 'border-box' }}>
            
            {/* KPI Cards */}
            <div className="kpi-container">
              <div style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>ORDER QUANTITY <HelpCircle size={12}/></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{data.kpis.orderQuantity.value}</div>
                  <div style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{data.kpis.orderQuantity.change}</div>
                </div>
              </div>
              
              <div style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>AVG. ORDER VALUE <HelpCircle size={12}/></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{data.kpis.avgOrderValue.value}</div>
                  <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{data.kpis.avgOrderValue.change}</div>
                </div>
              </div>

              <div style={{ flex: 1, backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>IMPRESSIONS <HelpCircle size={12}/></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>{data.kpis.impressions.value}</div>
                  <div style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>{data.kpis.impressions.change}</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-container">
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>SALES ANALYTICS <HelpCircle size={14} color="#9ca3af"/></div>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.salesAnalytics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `${value/1000}k`} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" activeDot={{ r: 6, fill: "#3b82f6", stroke: "white", strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '700', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                    GEOGRAPHICS SUMMARY
                    <div style={{ color: '#9ca3af', fontWeight: 'bold' }}>...</div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '2rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: '700', color: '#111827' }}>132.234</span>
                    <span style={{ backgroundColor: '#d1fae5', color: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>+2.1%</span>
                 </div>
                 {/* Map Placeholder */}
                 <div style={{ flex: 1, backgroundColor: '#f0f9ff', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#3b82f6', fontSize: '0.875rem', fontWeight: '600' }}>
                    [ World Map Rendering Here ]
                 </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>RECENT INVOICES <HelpCircle size={14} color="#9ca3af"/></div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #d1d5db', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '6px', fontSize: '0.875rem', color: '#374151', cursor: 'pointer' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 2H11L7.5 6.5V10L4.5 11V6.5L1 2Z" stroke="#374151" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Filter
                </button>
              </div>
              <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>NO</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>ID CUSTOMERS</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>CUSTOMERS NAME</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>ITEMS NAME</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>ORDER DATE</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>STATUS</th>
                    <th style={{ padding: '1rem', color: '#9ca3af', fontSize: '0.75rem', fontWeight: '600', borderBottom: '1px solid #f3f4f6' }}>PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {data.invoices.map((inv, index) => (
                    <tr key={index}>
                      <td style={{ padding: '1rem', color: '#374151', fontSize: '0.875rem' }}>{index + 1}</td>
                      <td style={{ padding: '1rem', color: '#374151', fontSize: '0.875rem', fontWeight: '500' }}>{inv.id}</td>
                      <td style={{ padding: '1rem', color: '#111827', fontSize: '0.875rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#e5e7eb', overflow: 'hidden' }}><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inv.customerName}`} alt="avatar" style={{width: '100%', height:'100%'}}/></div>
                        {inv.customerName}
                      </td>
                      <td style={{ padding: '1rem', color: '#374151', fontSize: '0.875rem' }}>{inv.itemsName}</td>
                      <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>{inv.orderDate}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ backgroundColor: inv.status === 'Paid' ? '#d1fae5' : '#ffedd5', color: inv.status === 'Paid' ? '#059669' : '#ea580c', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                          {inv.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: '#111827', fontSize: '0.875rem', fontWeight: '600' }}>{inv.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
