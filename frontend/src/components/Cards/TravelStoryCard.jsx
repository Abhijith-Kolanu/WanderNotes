import React from "react";
import moment from "moment";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";

const TravelStoryCard = ({
    imgUrl,
    title,
    date,
    story,
    visitedLocation = [],
    isFavourite,
    onFavouriteClick,
    onClick,
    onEdit, // Optional edit button if needed later
}) => {
    return (
        <div className="border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-400">
            <img
                src={imgUrl}
                alt={title}
                className="w-full h-56 object-cover cursor-pointer"
                onClick={onClick}
            />

            <div className="p-4 cursor-pointer" onClick={onClick}>
                <div className="flex items-center gap-3 justify-between">
                    {/* Title, Date, and Story */}
                    <div className="flex-1">
                        <h6 className="text-sm font-medium">{title}</h6>
                        <p className="text-xs text-slate-500 mb-1">
                            {date ? moment(date).format("Do MMM YYYY") : "--"}
                        </p>
                        <p className="text-sm text-slate-600 line-clamp-2">
                            {story?.slice(0, 60)}{story?.length > 60 && "..."}
                        </p>
                    </div>

                    {/* Favourite Icon Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavouriteClick?.();
                        }}
                        className="w-10 h-10 flex items-center justify-center bg-white/40 rounded-lg border hover:shadow"
                        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
                    >
                        <FaHeart
                            className={`text-lg transition-colors icon-btn ${isFavourite ? "text-red-500" : "text-gray-400"
                                }`}
                        />
                    </button>
                </div>

                {/* Visited Location Display */}
                {visitedLocation.length > 0 && (
                    <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200 mt-3 px-2 py-1 rounded">
                        <GrMapLocation className="text-sm" />
                        {visitedLocation.map((item, index) => (
                            <span key={index}>
                                {index === visitedLocation.length - 1 ? item : `${item}, `}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TravelStoryCard;
