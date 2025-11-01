import { GiPerspectiveDiceSixFacesRandom } from "react-icons/gi";
import { TbArrowsRandom } from "react-icons/tb";
import { IoFilterSharp } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { PiBathtubBold } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { useNavigationContext } from '../../../context/NavigationContext';
import Link from "next/link";

export const FilterSelectors = () => {

    const { navigateToRandomBackroll } = useNavigationContext();

    const fetchRandomQuote = async (limit = 1) => {
        try {
            const response = await fetch(`/api/random?limit=${limit}`);
            const data = await response.json();

            console.log('Random quote API response:', data); // Debug log

            if (response.ok && data.quote) {
                // Navigate to backrolls page with the random quote
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

    return (
        <div className="flex flex-row items-center gap-2 justify-center">
                <>
                <Link href="/series">
                    <IoFilterSharp title="Filter Quotes" size={30} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                </Link>
                    <GiPerspectiveDiceSixFacesRandom
                        title="Random Quote"
                        size={30}
                        onClick={() => fetchRandomQuote(1)}
                        className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                    <TbArrowsRandom
                        title="Random Series Quote"
                        size={26}
                        onClick={() => fetchRandomQuote(5)}
                        className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                    <BsChatQuote title="Submit a Quote" size={26} className="text-gray-600 hover:text-pink-500 cursor-pointer" />
                </>
        </div>
    )
}