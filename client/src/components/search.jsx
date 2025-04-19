import React, { useState, useRef, useEffect } from 'react';
import {HiMagnifyingGlass} from "react-icons/hi2"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef(null);
  const [mockSuggestions, setMockSuggestions] = useState([]); // Define mockSuggestions as a state variable
  const navigate=useNavigate()

  const handleInputChange = (event) => {
    const inputValue = event.target.value.toLowerCase();

    setSearchTerm(inputValue);

    if (inputValue.length > 0) {
      const filteredSuggestions = mockSuggestions.filter((option) => option.toLowerCase().includes(inputValue));
      const limitedSuggestions = filteredSuggestions.slice(0, 5); // limit to 10 suggestions
      setSuggestions(limitedSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      setActiveSuggestion(Math.max(-1, activeSuggestion - 1));
      event.preventDefault(); // Add this line
    } else if (event.key === 'ArrowDown') {
      setActiveSuggestion(Math.min(suggestions.length - 1, activeSuggestion + 1));
      event.preventDefault(); // Add this line
    } else if (event.key === 'Enter') {
      if (activeSuggestion >= 0) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      } else {
        searched(); // Call the searched function when Enter key is pressed
      }
    }
  };

  const searched = () => {
    if(searchTerm===""){
      return;
    }
    navigate('/search',{state:searchTerm  })
  }

  useEffect(() => {
    inputRef.current.focus();
    const getTitles = async () => {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts/titles`)
      setMockSuggestions(response.data);
    }
    getTitles();
  }, []);

  return (
    <div className='search'>
      <div className='search1'>
        <button type="submit" className='searchbtn' onClick={searched}><HiMagnifyingGlass className='searchIcon' /></button>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyPress={(event) => {
            if (event.charCode === 13) {
              searched(); // Call the searched function when Enter key is pressed
            }
          }}
          ref={inputRef}
        />
      </div>
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              className={index === activeSuggestion? 'active' : ''}
              onClick={() => handleSuggestionClick(suggestion)}
              onMouseEnter={() => setActiveSuggestion(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
