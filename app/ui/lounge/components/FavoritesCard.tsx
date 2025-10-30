import { RenderFavorites } from './favorites';

export default function FavoritesCard() {
    return (
        <div className="bg-gradient-to-br from-green-200 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 w-full min-w-0 max-w-full overflow-hidden">
            <div className="p-4 w-full min-w-0 max-w-full overflow-hidden">
                <RenderFavorites />
            </div>
        </div>
    );
}