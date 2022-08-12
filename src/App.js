import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!username) return;
    fetch(
      `https://api.github.com/users/${username}/repos?type=public&sort=update&per_page=100`
    )
      .then((response) => response.json())
      .then((data) => {
        const result = data
          .reverse()
          .sort((a, b) => (a.stargazers_count < b.stargazers_count ? 1 : -1));
        setRepos(result);
      });
  }, [username]);

  const handleSearch = async () => {
    setIsLoading(true);
    await fetch(`https://api.github.com/search/users?q=${query}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data.items);
      });
    setIsLoading(false);
  };
  return (
    <>
      <header>
        <h1>Github Client</h1>
      </header>
      <main>
        <section className="search">
          <input
            type="search"
            placeholder="Digite o username"
            value={query}
            onChange={({ target }) => setQuery(target.value)}
          />
          <button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Pesquisando..' : 'Pesquisar'}
          </button>
          {!!searchResults.length && (
            <>
              <h2>Resultado:</h2>
              <ul>
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <img src={user.avatar_url} alt={`Foto de ${user.login}`} />
                    <p>{user.login}</p>
                    {username === user.login ? (
                      '✓'
                    ) : (
                      <button onClick={() => setUsername(user.login)}>
                        Selecionar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section className="repos">
          {username ? (
            <>
              <h2>Repositórios de {username}:</h2>

              {repos.length ? (
                <ul>
                  {repos.map((repo) => (
                    <li key={repo.id}>
                      {repo.name} ({repo.stargazers_count})
                    </li>
                  ))}
                </ul>
              ) : (
                'Carregando..'
              )}
            </>
          ) : (
            <h2>Faça uma busca primeiro.</h2>
          )}
        </section>
      </main>
    </>
  );
}

export default App;
