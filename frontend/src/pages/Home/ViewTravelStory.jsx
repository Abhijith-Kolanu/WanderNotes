import React from 'react';
import { MdDeleteOutline, MdClose, MdUpdate } from 'react-icons/md';
import moment from 'moment';
import { GrMapLocation } from 'react-icons/gr';

const ViewTravelStory = ({ storyInfo, onClose, onUpdateClick, onDeleteClick }) => {
    return (
        <div className='relative'>
            <div className='flex items-center justify-end'>
                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                        <button className='btn-small' onClick={onUpdateClick}>
                            <MdUpdate className='text-lg' /> Update Story
                        </button>

                        <button className='btn-small btn-delete' onClick={onDeleteClick}>
                            <MdDeleteOutline className='text-lg' /> Delete
                        </button>

                        <button className='' onClick={onClose}>
                            <MdClose className='text-xl text-slate-400' />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 py-4">
                <div>
                    <div className='flex-1 flex flex-col gap-2 py-4'>
                        <h1 className='text-2xl text-slate-950'>
                            {storyInfo && storyInfo.title}
                        </h1>
                    </div>
                </div>
                <div className='flex flex-row justify-between gap-3'>
                    <span className="text-xs text-slate-500">
                        {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
                    </span>

                    {/* Visited Locations below date */}
                    {storyInfo?.visitedLocation?.length > 0 && (
                        <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-1 w-fit mt-1">
                            <GrMapLocation className="text-sm" />
                            <span>
                                {storyInfo.visitedLocation.map((item, index) =>
                                    index === storyInfo.visitedLocation.length - 1
                                        ? `${item}`
                                        : `${item}, `
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <img
                src={storyInfo && storyInfo.imageUrl}
                alt="Selected"
                className='w-full h-[300px] object-cover rounded-lg'
            />
            <div className='mt-4'>
                <p className='text-sm text-slate-950 leading-6 text-justify whitespace-pre-line'>
                    {storyInfo.story}
                </p>
            </div>
        </div>
    );
};

export default ViewTravelStory;
