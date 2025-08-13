'use client';

import { categories } from '../../../lib/repertoire';

export default function SelectSeasons() {

    const backgroundColor = ["#FAD1FF", "#D6CFFC", "#DCE9B3", "#A8CAFF" ]
    const selectBackgroundColor = (index: number) => {
    return backgroundColor[index];
    }

    return (
        <div className="select text-gray-800 rounded-lg gap-2 flex flex-col w-72 h-auto">
            {categories.map((category, idx) => (
                    <div 
                    key={idx}
                    style={{backgroundColor: selectBackgroundColor(idx)}}
                    className="flex relative border rounded-md p-2 justify-center items-center cursor-pointer">
                        <h3 className="text-lg font-semibold p-1">{category.name}</h3>
                    </div>
            )
            )}
        </div>
    );
}
