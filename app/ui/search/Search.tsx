'use client';

import "./search.scss";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import usePlaceholderLogic from "./placeholderLogic";

interface SearchProps {
  searchModal: boolean;
  openSearchModal: () => void;
  setSearchInput: (input: string) => void;
  clearSearchInput: () => void;
  searchInput: string | null;
}

export default function Search({ 
  searchModal,
  openSearchModal,
  setSearchInput,
  clearSearchInput,
  searchInput,
}: SearchProps ) {
  const placeholder = usePlaceholderLogic();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value)

    if (value) {
      if (!searchInput) {
        openSearchModal()
      }
    } else {
      clearSearchInput();
    }
  };

    return (
    <div className="search">
    <div className="search__input-container">
      {searchModal ? 
      <RiCloseLargeFill 
      onClick={clearSearchInput} 
      size={20} className="search__closeIcon" 
      /> : 
      <FaSearch size={20} className="search__icon" />}
      <input
        className="search__input"
        id="search-input"
        placeholder={placeholder}
        type="text"
        value={searchInput || ''}
        onChange={handleInputChange}
        aria-label="Search"
      />
    </div>
    <div className="search__border"></div>
    <button aria-label="Voice search" className="search__micButton">
      <FaMicrophone size={20} className="search__micIcon"
      />
    </button>
  </div>
    );
}