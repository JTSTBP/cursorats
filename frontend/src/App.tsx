import React, { useEffect, useState } from 'react';
import './App.css';
import JobPostForm from './components/jobposting';

function Login({ onLogin }: { onLogin: (role: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Recruiter');
  return (
    <div className="login-bg">
      <div className="login-container">
        <h2>Jobs Territory — ATS Login</h2>
        <input
          className="input-box"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="input-box"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <select value={role} onChange={e => setRole(e.target.value)} className="input-box">
          <option>Admin</option>
          <option>Recruiter</option>
          <option>Manager</option>
        </select>
        <button className="login-btn" onClick={() => onLogin(role)}>
          Login
        </button>
      </div>
    </div>
  );
}

const sidebarTabs = ["Dashboard","Jobs","Candidates","Applications","Users","Reports","Settings"] as const;

type SidebarTab = typeof sidebarTabs[number];

type User = {
  name: string;
  email: string;
  designation: string;
  reporter: string;
  password: string;
  isAdmin: boolean;
  status: string;
};

const sampleUsers: User[] = [
  { name: "Priya Singh", email: "priya@jt.com", designation: "Admin", reporter: "-", password: "", isAdmin: true, status: "Active" },
  { name: "Arjun Sen", email: "arjun@jt.com", designation: "Recruiter", reporter: "Priya Singh", password: "", isAdmin: false, status: "Active" },
  { name: "Meera Das", email: "meera.manager@jt.com", designation: "Manager", reporter: "Priya Singh", password: "", isAdmin: false, status: "Active" },
  { name: "Ravi Kumar", email: "ravi@jt.com", designation: "Recruiter", reporter: "Meera Das", password: "", isAdmin: false, status: "Inactive" },
];

function AddUserModal({ onSave, onCancel, users }: {
  onSave: (user: User) => void,
  onCancel: () => void,
  users: User[]
}) {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    designation: '',
    reporter: '-',
    password: '',
    isAdmin: false,
    status: 'Active',
  });
  const designationList = ['Admin','Recruiter','Manager'];
  const reporterList = ['-'].concat(users.map(u=>u.name));

  const handleChange = (field: keyof User, val: any) => {
    setUser(prev => ({ ...prev, [field]: val }));
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-main adduser-modal">
        <h2>Add User</h2>
        <div className="modal-fields">
          <label>Name
            <input className="input-box" value={user.name} onChange={e=>handleChange('name', e.target.value)} placeholder="User name"/>
          </label>
          <label>Email
            <input className="input-box" type="email" value={user.email} onChange={e=>handleChange('email', e.target.value)} placeholder="Email"/>
          </label>
          <label>Designation
            <select className="input-box" value={user.designation} onChange={e=>handleChange('designation', e.target.value)}>
              <option value="">Select Designation</option>
              {designationList.map(d=>(
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label>Reporter
            <select className="input-box" value={user.reporter} onChange={e=>handleChange('reporter', e.target.value)}>
              {reporterList.map(r=>(
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label>Password
            <input className="input-box" value={user.password} type="password" onChange={e=>handleChange('password', e.target.value)} placeholder="Set password"/>
          </label>
          <label style={{display:'flex',alignItems:'center',marginTop:10}}>
            <input type="checkbox" checked={user.isAdmin} onChange={e=>handleChange('isAdmin',e.target.checked)} style={{marginRight:8}} />
            Is Admin
          </label>
        </div>
        <div className="modal-actions-row">
          <button className="cancel-modal-btn" onClick={onCancel}>Cancel</button>
          <button className="save-modal-btn" onClick={()=>onSave(user)}>Save</button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ role }: { role: string }) {
  const showReports = role === 'Admin' || role === 'Manager';
  const visibleTabs: SidebarTab[] = [
    "Dashboard",
    "Jobs",
    "Candidates",
    "Applications",
    "Users",
    ...(showReports ? (["Reports"] as const) : []),
    "Settings",
  ];
  const [selectedTab, setSelectedTab] = useState<SidebarTab>('Dashboard');
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 770;

  // Load users from backend on mount
  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then((data: User[]) => setUsers(data))
      .catch(() => {
        // keep sampleUsers on failure
      });
  }, []);

  // Create user via backend
  const handleAddUser = (user: User) => {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((created: User) => {
        setUsers(prev => [...prev, created]);
        setShowAddModal(false);
      })
      .catch(() => {
        // fallback: still add locally
        setUsers(prev => [...prev, user]);
        setShowAddModal(false);
      });
  };

  React.useEffect(() => {
    const handler = () => {
      if(window.innerWidth >= 770) setShowSidebar(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Sidebar contents only
  const sidebar = (
    <aside className={`sidebar${isMobile && showSidebar ? ' sidebar-mobile-active' : ''}${isMobile ? ' sidebar-mobile' : ''}`}
      style={isMobile && !showSidebar ? {display:'none'} : {}}>
      <h3>ATS Panel</h3>
      <nav>
        <ul>
          {visibleTabs.map(tab => (
            <li
              key={tab}
              className={selectedTab === tab ? "active-tab" : ""}
              onClick={() => {
                setSelectedTab(tab);
                if (isMobile) setShowSidebar(false);
              }}
            >{tab}</li>
          ))}
        </ul>
      </nav>
    </aside>
  );

  return (
    <div className="dashboard-bg">
      {/* Sidebar overlay on mobile */}
      {isMobile && showSidebar && <div className="sidebar-ovl" onClick={()=>setShowSidebar(false)}></div>}
      {(!isMobile || showSidebar) && sidebar}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, {role}</h1>
        </header>
        {selectedTab === 'Dashboard' && (
          <>
            <section className="cards-row">
              <div className="stat-card">
                <div className="card-title">Open Jobs</div>
                <div className="card-value">8</div>
              </div>
              <div className="stat-card">
                <div className="card-title">Total Candidates</div>
                <div className="card-value">127</div>
              </div>
              <div className="stat-card">
                <div className="card-title">Open Applications</div>
                <div className="card-value">45</div>
              </div>
              <div className="stat-card">
                <div className="card-title">This Week Shortlisted</div>
                <div className="card-value">12</div>
              </div>
            </section>
            <section style={{marginTop:32}}>
              <div className="pipeline-chart">
                <div className="stage">Screening <div className="bar bar1"></div> <span>12</span></div>
                <div className="stage">Shortlisted <div className="bar bar2"></div> <span>8</span></div>
                <div className="stage">Interview 1 <div className="bar bar3"></div> <span>6</span></div>
                <div className="stage">Interview 2 <div className="bar bar4"></div> <span>3</span></div>
                <div className="stage">Offer <div className="bar bar5"></div> <span>2</span></div>
                <div className="stage">Hired <div className="bar bar6"></div> <span>1</span></div>
                <div className="stage">Rejected <div className="bar bar7"></div> <span>13</span></div>
              </div>
            </section>
          </>
        )}
        {selectedTab === 'Jobs' && (
         <JobPostForm/>
        )}
        {selectedTab === 'Candidates' && (
          <section>
            <h2>Candidates</h2>
            <p>Manage candidate profiles, upload CVs, and search/filter. (coming soon)</p>
          </section>
        )}
        {selectedTab === 'Applications' && (
          <section>
            <h2>Applications</h2>
            <p>Link candidates to jobs and track their progress. (coming soon)</p>
          </section>
        )}
        {selectedTab === 'Users' && (
          <section className="users-section">
            <div className="users-header-row">
              <h2 className="users-main-heading">User Management</h2>
              <button className="add-user-btn" onClick={()=>setShowAddModal(true)}>Add User</button>
            </div>
            <div className="user-table-wrapper">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Reporter</th>
                    <th>Admin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={i}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.designation}</td>
                      <td>{u.reporter}</td>
                      <td>{u.isAdmin ? "Yes" : "No"}</td>
                      <td><span className={u.status === "Active" ? "active-badge" : "inactive-badge"}>{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {showAddModal && (
              <AddUserModal users={users} onSave={handleAddUser} onCancel={()=>setShowAddModal(false)}/>
            )}
          </section>
        )}
        {selectedTab === 'Reports' && (
          <section>
            <h2>Reports</h2>
            <p>Visualize pipeline, job stats, and recruiter performance. (coming soon)</p>
          </section>
        )}
        {selectedTab === 'Settings' && (
          <section>
            <h2>Settings</h2>
            <p>Change preferences, manage your account, etc. (coming soon)</p>
          </section>
        )}
      </main>
    </div>
  );
}

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  return (
    <div className="App">
      {!userRole ? (
        <Login onLogin={role => setUserRole(role)} />
      ) : (
        <Dashboard role={userRole} />
      )}
    </div>
  );
}

export default App;
