// src/components/Collection/DescriptionCard.tsx
import React from 'react';

type Props = {
  description: string;
};

const DescriptionCard: React.FC<Props> = ({ description }) => {
  return (
    <div className="min-h-130 px-10 py-9  bg-gray-100 flex flex-col gap-2 mt-6">
      <p className="mx-auto max-w-160 text-center text-xs text-gray-600 leading-6 whitespace-pre-line">
        {description}
      </p>
      <div className="mt-4 h-75  bg-gray-100" />
    </div>
  );
};

export default DescriptionCard;
