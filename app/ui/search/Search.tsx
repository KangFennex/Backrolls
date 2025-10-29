'use client';

import "./search.scss";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import usePlaceholderLogic from "../../lib/utils";
import { useSearchContext } from "../../context/SearchContext";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function Search() {
  const {
    searchModal,
    clearSearchInput,
    searchInput,
    handleInputChange,
    handleSearchSubmit,
  } = useSearchContext();
  const placeholder = usePlaceholderLogic();
  const { resetTranscript, listening } = useSpeechRecognition();

  /*   if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      console.log("Browser doesn't support speech recognition");
    }
  
      useEffect(() => {
      // Update transcript to input when listening stops
      if (!listening && isListening) {
        handleInputChange(transcript);
        setIsListening(false);
      }
    }, [listening, transcript, isListening, handleInputChange]);
  */

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange(value)

    if (!value) {
      clearSearchInput();
    }
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      resetTranscript();
      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US'
      });
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
          onChange={handleInput}
          onKeyDown={handleSearchSubmit}
          aria-label="Search"
        />
      </div>
      <div className="search__border"></div>
      <button
        aria-label="Voice search"
        className={`search__micButton ${listening ? 'listening' : ''}`}
        onClick={toggleListening}
      >
        <FaMicrophone
          size={20}
          className="search__micIcon"
        />
      </button>
    </div>
  );
}