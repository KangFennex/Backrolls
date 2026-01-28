'use client';

import "@/app/scss/search/search.scss";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import usePlaceholderLogic from "../../lib/utils";
import { useSearchContext } from "../../context/SearchContext";
import SearchModal from "./SearchModal";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export default function Search() {
  const {
    searchModal,
    clearSearchInput,
    searchInput,
    handleInputChange,
    handleSearchSubmit,
  } = useSearchContext();
  const placeholder = usePlaceholderLogic();
  const { transcript, resetTranscript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);

  // Update search input when transcript changes
  useEffect(() => {
    if (transcript) {
      handleInputChange(transcript);
    }
  }, [transcript, handleInputChange]);

  const toggleListening = async () => {
    if (!browserSupportsSpeechRecognition) {
      console.warn("Browser doesn't support speech recognition");
      setMicPermissionDenied(true);
      setTimeout(() => setMicPermissionDenied(false), 500);
      return;
    }

    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      try {
        resetTranscript();
        await SpeechRecognition.startListening({
          continuous: false,
          language: 'en-US'
        });
      } catch (error) {
        console.error('Error accessing microphone:', error);
        setMicPermissionDenied(true);
        setTimeout(() => setMicPermissionDenied(false), 500);
      }
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleInputChange(value)

    if (!value) {
      clearSearchInput();
    }
  };


  return (
    <>
      <div className="search-container relative">
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
            <div className="search__border flex justify-center"></div>
            <button
              aria-label="Voice search"
              className={`search__micButton ${listening ? 'listening' : ''} ${micPermissionDenied ? 'shake' : ''}`}
              onClick={toggleListening}
            >
              <FaMicrophone
                size={20}
                className="search__micIcon"
              />
            </button>
          </div>
        </div>
      </div>
      {searchModal && typeof document !== 'undefined' && createPortal(
        <SearchModal />,
        document.body
      )}
    </>
  );
}