import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { BsChatQuote } from "react-icons/bs";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone } from "react-icons/fa";
import { PiBathtubBold } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';

export const Selectors = () => {

    const { resetTranscript, listening } = useSpeechRecognition();
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    const { navigateToRandomBackroll } = useNavigationContext();

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

    const fetchRandomQuote = async (limit = 1) => {
        try {
            const response = await fetch(`/api/random?limit=${limit}`);
            const data = await response.json();

            console.log('Random quote API response:', data); // Debug log

            if (response.ok && data.quote) {
                // Navigate to backrolls page with the random quote
                console.log(data.quote);
                navigateToRandomBackroll(data.quote);
            } else {
                // Handle API errors or missing quote
                const errorMessage = data.error || 'Failed to fetch random quote';
                console.error('Error fetching random quote:', errorMessage);
                // You could add user feedback here, like a toast notification
            }
        } catch (error) {
            console.error('Error fetching random quote:', error);
        }
    }

    useEffect(() => {
        const checkScreenSize = () => {
            setIsSmallScreen(window.innerWidth < 360);
        };

        checkScreenSize();

        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="flex flex-row items-center gap-2 mr-2">
            {isSmallScreen ? (
                // Show bath icon on small screens
                <PiBathtubBold
                    title="Menu Options"
                    size={25}
                    className="text-gray-600 hover:text-pink-500 cursor-pointer"
                />
            ) : (
                <>
                    <GiPerspectiveDiceSixFacesRandom
                        title="Random Quote"
                        size={25}
                        onClick={() => fetchRandomQuote(1)}
                        className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                    <TbArrowsRandom
                        title="Random Quotes"
                        size={23}
                        onClick={() => fetchRandomQuote(5)}
                        className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                    <BsChatQuote title="Submit a Quote" size={23} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
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
                </>
            )}
        </div>
    )
}