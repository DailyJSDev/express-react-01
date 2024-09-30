import './App.css';
import { useState, useEffect } from 'react';

import { Player } from './components/player';

function App() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const results = await fetch('/user/all');
    const { users } = await results.json();
    console.log('results : ', users);
    setUsers(users);
  };

  const setFavorite = async ({ id, favorite }) => {
    try {
      const results = await fetch(`/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ favorite: favorite }),
      });

      if (results.status === 201) {
        // update state
        const { id: userId } = await results.json();

        const itemIndex = users.map((user) => user._id).indexOf(userId);
        const newUser = { ...users[itemIndex], favorite: favorite };

        const newList = users.toSpliced(itemIndex, 1, newUser);

        setUsers(newList);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers().catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">mlb_scores</header>
      <ul>
        {users.length &&
          users.map((user) => (
            <Player key={user._id} user={user} setFavorite={setFavorite} />
          ))}
      </ul>
    </div>
  );
}

export default App;
