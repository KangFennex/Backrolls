'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import { series } from '../../lib/repertoire';
import { useSeriesSeasons } from '../../lib/hooks';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Submit() {
    return (
        <Box className="min-h-screen bg-gradient-to-br flex rounded-md border border-pink-500 bg-[#CCE6FF]">
            <Card
                className="w-full max-w-2xl backdrop-blur-lg shadow-2xl"
                sx={{
                    minWidth: [400, 500, 700],
                    maxWidth: [450, 550, 750],
                    backgroundColor: 'transparent'
                }}
            >
                <CardHeader
                    title={
                        <h1 className="text-3xl font-bold text-center bg-clip-text">
                            Submit a Quote
                        </h1>
                    }
                    subheader={
                        <p className="text-center text-lg">
                            Help us grow our collection by submitting your favorite quotes!
                        </p>
                    }
                    className="text-center"
                />
                <CardContent>
                    <Box>
                        <SubmitForm />
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

function SubmitForm() {

    const {
        selectedSeries,
        selectedSeason,
        setSelectedSeries,
        setSelectedSeason,
        getSeasonOptions,
        getEpisodeOptions,
    } = useSeriesSeasons();
    const [formData, setFormData] = useState({
        quote: '',
        speaker: '',
        series: '',
        season: '',
        episode: '',
        timestamp: '',
        context: '',
    });

    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;

    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSeriesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        setSelectedSeries(value);

        setFormData({
            ...formData,
            series: value,
            season: '',
            episode: '',
        });

        setSelectedSeason(0);
    };

    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);

        setSelectedSeason(Number(event.target.value));

        setFormData({
            ...formData,
            season: value.toString(),
            episode: '',
        });
    }

    const handleEpisodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;

        setFormData({
            ...formData,
            episode: value
        });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


        if (!isAuthenticated) {
            alert('You must be logged in to submit a quote.');
            return;
        }

        try {
            setSubmissionStatus('submitting');
            setIsLoading(true);

            const submitResponse = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ ...formData }),
            });

            if (!submitResponse.ok) {
                throw new Error('Failed to submit quote. Please try again later.');
            }

            if (submitResponse.ok) {
                setSubmissionStatus('success');
                setSuccessMessage('Quote submitted successfully!');

                setFormData({
                    series: '',
                    season: '',
                    episode: '',
                    quote: '',
                    speaker: '',
                    timestamp: '',
                    context: '',
                });
            }

        } catch (error) {
            setSubmissionStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred');

        } finally {
            setIsLoading(false);
        }


        console.log({ ...formData });
    };

    const seasonOptions = getSeasonOptions(selectedSeries);
    const episodeOptions = getEpisodeOptions(selectedSeries, selectedSeason);

    return (
        <form
            className="flex flex-col gap-1 p-1"
            onSubmit={handleSubmit}
        >

            {/* Series and Season Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Series Select */}
                <div className="flex flex-col">
                    <label
                        htmlFor="series"
                        className="mb-2 font-semibold text-lg"
                    >
                        Series *
                    </label>
                    <select
                        name="series"
                        id="series"
                        onChange={handleSeriesChange}
                        value={selectedSeries}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                        <option value="">Select a series</option>
                        {series.map((show) => (
                            <option
                                key={show.name}
                                value={show.name}
                                className="bg-gray-800 text-white"
                            >
                                {show.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Season Select */}
                <div className="flex flex-col">
                    <label
                        htmlFor="season"
                        className="mb-2 font-semibold text-lg"
                    >
                        Season *
                    </label>
                    <select
                        name="season"
                        id="season"
                        onChange={handleSeasonChange}
                        value={selectedSeason}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                        <option value="">Select a season</option>
                        {seasonOptions.map(option => (
                            <option
                                key={option.value}
                                value={option.value}
                                className="bg-gray-800 text-white"
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Episode Input */}

            <div className="flex flex-col">
                <label htmlFor="episode" className="mb-2 font-semibold text-lg">
                    Episode *
                </label>
                <select
                    name="episode"
                    id="episode"
                    onChange={handleEpisodeChange}
                    value={formData.episode}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 appearance-none"
                >
                    <option value="">Select an episode</option>
                    {episodeOptions.map(option => (
                        <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Speaker Input */}
            <div className="flex flex-col">
                <label
                    htmlFor="speaker"
                    className="mb-2 font-semibold text-lg"
                >
                    Speaker *
                </label>
                <input
                    type="text"
                    name="speaker"
                    id="speaker"
                    required
                    value={formData.speaker}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                    placeholder="Who said it?"
                />
            </div>

            {/* Episode and Timestamp Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                {/* Quote Input */}
                <div className="flex flex-col">
                    <label
                        htmlFor="quote"
                        className="mb-2 font-semibold text-lg"
                    >
                        Quote *
                    </label>
                    <textarea
                        name="quote"
                        id="quote"
                        required
                        rows={3}
                        value={formData.quote}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 resize-none"
                        placeholder="Say what?"
                    />
                </div>

                {/* Timestamp Input */}
                <div className="flex flex-col">
                    <label
                        htmlFor="timestamp"
                        className="mb-2 font-semibold text-lg"
                    >
                        Timestamp
                    </label>
                    <input
                        type="text"
                        name="timestamp"
                        id="timestamp"
                        value={formData.timestamp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200"
                        placeholder="e.g., 1:23:45"
                    />
                </div>
            </div>

            {/* Context Input */}
            <div className="flex flex-col">
                <label
                    htmlFor="context"
                    className="mb-2 font-semibold text-lg"
                >
                    Extra Bit
                </label>
                <textarea
                    name="context"
                    id="context"
                    rows={2}
                    value={formData.context}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-white/30 bg-white  focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Got juicy details about this?"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl"
            >
                Submit Backroll
            </button>

            <p className="text-gray-400 text-sm text-center">
                * Required fields
            </p>
        </form >
    );
}