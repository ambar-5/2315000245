import { useState, useEffect } from 'react'

function App() {
  const [notifications, setNotifications] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const fetchNotifications = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) return;
    
    try {
      await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message })
      });
      setTitle('');
      setMessage('');
      fetchNotifications();
    } catch (error) {
      console.error("Error sending notification", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PATCH'
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking read", error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Notification System</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Send Notification</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="Title" 
            style={{ padding: '8px' }} 
          />
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            placeholder="Message" 
            style={{ padding: '8px' }} 
          />
          <button type="submit" style={{ padding: '10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Send
          </button>
        </form>
      </div>

      <div>
        <h3>Recent Notifications</h3>
        {notifications.length === 0 ? <p>No notifications.</p> : null}
        {notifications.map(n => (
          <div key={n.id} style={{ 
            borderLeft: `4px solid ${n.isRead ? '#ccc' : '#28a745'}`, 
            background: '#f9f9f9',
            padding: '10px 15px', 
            marginBottom: '10px',
            borderRadius: '0 4px 4px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{n.title}</h4>
              <p style={{ margin: 0, fontSize: '14px' }}>{n.message}</p>
            </div>
            {!n.isRead && (
              <button 
                onClick={() => markAsRead(n.id)}
                style={{ background: 'none', border: '1px solid #28a745', color: '#28a745', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Mark Read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
