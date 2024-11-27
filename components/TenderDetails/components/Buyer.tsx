import React from 'react';
import { countryCodeToFlagPath } from "@/utils/codeConvertor";

interface BuyerProps {
  number: number;
  name: string;
  email: string;
  website: string;
  phone: string;
  address: {
    city: string;
    street: string;
    postalCode: string;
    countryCode: string;
  };
}

export const Buyer: React.FC<BuyerProps> = ({
  number,
  name,
  email,
  website,
  phone,
  address
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const formatAddress = () => {
    const parts = [
      address.street,
      address.city,
      address.postalCode,
      address.countryCode
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-solid border-zinc-300">
      <div 
        className="flex gap-4 justify-between items-center p-6 w-full cursor-pointer bg-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="self-stretch px-2.5 my-auto text-center text-indigo-700 whitespace-nowrap bg-indigo-50 rounded-full border border-indigo-300 border-solid h-[27px] min-h-[26px] w-[27px]">
            {number}
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-base font-medium text-neutral-950">
              {name}
            </span>
            {address.countryCode && (
              <img
                src={countryCodeToFlagPath(address.countryCode)}
                alt={`${address.countryCode} flag`}
                className="w-6 h-4 object-cover"
              />
            )}
          </div>
        </div>
        <img
          loading="lazy"
          src={isExpanded 
            ? "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/c661171fab93fec4d835646f1cf301cf6565947497b440bcbf4b046119dd52f5?apiKey=27ce83af570848e9b22665bc31a03bc0&" 
            : "https://cdn.builder.io/api/v1/image/assets/27ce83af570848e9b22665bc31a03bc0/b37a8bb90cc4ed1b56e071cb80a5177dfecf55c25af24cbe0bba30c2994ea0ee?apiKey=27ce83af570848e9b22665bc31a03bc0&"
          }
          alt={isExpanded ? "Collapse" : "Expand"}
          className="w-6 h-6 object-contain"
        />
      </div>
      
      {isExpanded && (
        <div className="px-6 pb-6 bg-white border-t border-zinc-300">
          <div className="grid grid-cols-2 gap-6 mt-4">
            {email && (
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-neutral-600">Email</div>
                <a 
                  href={`mailto:${email}`} 
                  className="text-blue-600 hover:underline break-all"
                >
                  {email}
                </a>
              </div>
            )}
            {website && (
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-neutral-600">Website</div>
                <a 
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline break-all"
                >
                  {website}
                </a>
              </div>
            )}
            {phone && (
              <div className="flex flex-col gap-1">
                <div className="text-sm font-medium text-neutral-600">Phone</div>
                <a 
                  href={`tel:${phone}`}
                  className="text-neutral-950 hover:underline"
                >
                  {phone}
                </a>
              </div>
            )}
            {formatAddress() && (
              <div className="col-span-2 flex flex-col gap-1">
                <div className="text-sm font-medium text-neutral-600">Address</div>
                <div className="text-neutral-950">{formatAddress()}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 