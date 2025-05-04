import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '60px',
      backgroundColor: '#0f172a',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Center everything
      padding: '0 2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      <nav>
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          gap: '2rem',
          margin: 0,
          padding: 0
        }}>
          <li><Link to="/dashboard" style={linkStyle}>Dashboard</Link></li>
          <li><Link to="/live-data" style={linkStyle}>Live Data</Link></li>
          <li><Link to="/logs" style={linkStyle}>Logs</Link></li>
          <li><Link to="/kpi" style={linkStyle}>KPI</Link></li>
          <li><Link to="/errors" style={linkStyle}>Errors</Link></li>
          <li><Link to="/configuration" style={linkStyle}>Configuration</Link></li>
        </ul>
      </nav>
    </header>
  );
}

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '16px'
};
