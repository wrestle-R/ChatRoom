import { useState } from 'react';

function UserSearch({ onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    
    console.log(`Searching for: ${searchQuery}`); // Add logging
    
    try {
      const url = `http://localhost:3000/api/users/search?query=${encodeURIComponent(searchQuery)}`;
      console.log(`Fetching from URL: ${url}`); // Log the URL
      
      const response = await fetch(url);
      
      console.log(`Response status: ${response.status}`); // Log response status
      
      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Search results:', data); // Log the results
      
      setSearchResults(data);
    } catch (err) {
      console.error('Error searching users:', err);
      setError('Failed to search users. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <form onSubmit={handleSearch} className="flex mb-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by username..."
          className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}

      {searchResults.length > 0 ? (
        <div className="mt-3">
          <h3 className="font-medium text-gray-700 mb-2">Search Results:</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {searchResults.map((user) => (
              <li 
                key={user.userId}
                onClick={() => onSelectUser(user)}
                className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {(user.username || user.firstName || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{user.username || `${user.firstName} ${user.lastName}`}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : searchQuery && !loading && (
        <p className="text-sm text-gray-500 mt-2">No users found matching "{searchQuery}"</p>
      )}
    </div>
  );
}

export default UserSearch;