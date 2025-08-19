import React, { useState, useEffect } from 'react';
import './App.css';
import FocusMinimal from './FocusMinimal';
import Auth from './Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FDFBF7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#2E2E2E'
        }}>
          Загрузка...
        </div>
      </div>
    );
  }

  return user ? <FocusMinimal user={user} /> : <Auth onAuthStateChange={setUser} />;
}

export default App;
