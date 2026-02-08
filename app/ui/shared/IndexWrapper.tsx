import React from 'react';

interface IndexWrapperProps {
    children: React.ReactNode;
    index: number;
}

export function IndexWrapper({ children, index }: IndexWrapperProps) {
    return (
        <div className="flex items-center gap-2 max-w-full">
            <h4 className="antique-parchment-text-dark tektur rotate-270 text-[30px] p-2.5 w-[30px] flex-shrink-0">
                {index + 1}
            </h4>
            {children}
        </div>
    );
}
