'use client';

import "./search2.scss";
import { FaSearch, FaMicrophone } from "react-icons/fa";
import usePlaceholderLogic from "../../lib/utils";
import { useSearchContext } from "../../context/SearchContext";
import { useFiltersContext } from '../../context/FiltersModalContext';
import SearchModal from "./SearchModal";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { IoFilterSharp } from "react-icons/io5";
import { useRainbowColors } from '../../lib/hooks';


export default function Search2() {
    const {
        searchModal,
        clearSearchInput,
        searchInput,
        handleInputChange,
        handleSearchSubmit,
    } = useSearchContext();
    const placeholder = usePlaceholderLogic();
    const { resetTranscript, listening } = useSpeechRecognition();
    const { isFiltersModalVisible, toggleFilters } = useFiltersContext();
    const { getColorForIcon } = useRainbowColors();

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

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        handleInputChange(value)

        if (!value) {
            clearSearchInput();
        }
    };

    return (
        <div className="search2-container">
            <div className="search2">

                {/* Search Input */}
                <div className="search2__input-wrapper">
                    <input
                        className="search2__input"
                        id="search2-input"
                        placeholder={placeholder}
                        type="text"
                        value={searchInput || ''}
                        onChange={handleInput}
                        onKeyDown={handleSearchSubmit}
                        aria-label="Search"
                    />
                </div>

                {/* Filter Button */}

                <button
                    aria-label="Filter Backrolls"
                    className="search2__icon-btn"
                    onClick={() => toggleFilters()}
                >
                    <IoFilterSharp
                        title="Filter Backrolls"
                        size={30}
                        className="search2__icon"
                    />
                </button>

                {/* Microphone Button */}
                <button
                    aria-label="Voice search"
                    className={`search2__icon-btn ${listening ? 'listening' : ''}`}
                    onClick={toggleListening}
                >
                    <FaMicrophone
                        size={20}
                        className="search2__icon"
                    />
                </button>

                {/* Search Button */}
                <button
                    aria-label="Search"
                    className="search2__icon-btn"
                    onClick={() => {
                        if (searchInput) {
                            const event = new KeyboardEvent('keydown', { key: 'Enter' });
                            handleSearchSubmit(event as any);
                        }
                    }}
                >
                    <FaSearch size={20} className="search2__icon" />
                </button>
            </div>

            {searchModal && <SearchModal />}
        </div>
    );
}
