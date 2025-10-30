import { westernZodiacSigns, chineseZodiacSigns } from '../../../lib/repertoire';

interface ProfileData {
    username: string;
    catchPhrase: string;
    zodiacSign: string;
    FavSeason: string;
    FavQueen: string;
    aboutMe: string;
    links: string;
    numbers: string;
}

interface ProfileDetailsCardProps {
    profileData: ProfileData;
    isEditing: boolean;
    onEditToggle: () => void;
    onInputChange: (field: string, value: string) => void;
    onSave: () => void;
    onCancel: () => void;
}

export default function ProfileDetailsCard({ 
    profileData, 
    isEditing, 
    onEditToggle, 
    onInputChange, 
    onSave, 
    onCancel 
}: ProfileDetailsCardProps) {
    return (
        <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                        ✨ My Details
                    </h3>
                    <button
                        onClick={onEditToggle}
                        className="bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200"
                    >
                        ✏️
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catch Phrase</label>
                        <input
                            type="text"
                            value={profileData.catchPhrase}
                            onChange={(e) => onInputChange('catchPhrase', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Zodiac Sign</label>
                        <select
                            value={profileData.zodiacSign}
                            onChange={(e) => onInputChange('zodiacSign', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Select zodiac sign</option>
                            <optgroup label="Western Zodiac">
                                {westernZodiacSigns.map((sign) => (
                                    <option key={`western-${sign}`} value={`${sign} (Western)`}>
                                        {sign}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Chinese Zodiac">
                                {chineseZodiacSigns.map((sign) => (
                                    <option key={`chinese-${sign}`} value={`${sign} (Chinese)`}>
                                        {sign}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Season</label>
                        <input
                            type="text"
                            value={profileData.FavSeason}
                            onChange={(e) => onInputChange('FavSeason', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Queen</label>
                        <input
                            type="text"
                            value={profileData.FavQueen}
                            onChange={(e) => onInputChange('FavQueen', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                    <div className="mt-6 flex gap-2 flex-col sm:flex-row">
                        <button
                            onClick={onSave}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                        >
                            Save
                        </button>
                        <button
                            onClick={onCancel}
                            className="flex-1 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}