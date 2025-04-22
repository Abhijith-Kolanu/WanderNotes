import React, { useState } from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose, MdHomeMax } from "react-icons/md"
import DateSelector from '../../components/Input/DateSelector'
import ImageSelector from '../../components/Input/ImageSelector'
import TagInput from '../../components/Input/TagInput'
import axiosInstance from "../../utils/axiosinstance.js"
import moment from 'moment'
import { toast } from "react-toastify"
import uploadImage from "../../utils/uploadImage"
const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
    const [title, setTitle] = useState("")
    const [storyImg, setStoryImg] = useState(null)
    const [story, setStory] = useState("")
    const [visitedLocation, setVisitedLocation] = useState([])
    const [visitedDate, setVisitedDate] = useState(null)
    const [error, setError] = useState("")

    const updateTravelStory = async () => {
    }
    const addNewTravelStory = async () => {
        try {
            let imageUrl = ""
            if (storyImg) {
                const imageUploadRes = await uploadImage(storyImg)
                imageUrl = imageUploadRes.imageUrl || ""
            }
            const response = await axiosInstance.post("/add-travel-story", {
                title, story, imageUrl: imageUrl || "", visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            })
            if (response.data && response.data.story) {
                toast.success("Story Added Successfully")
                getAllTravelStories()
                onClose()
            }
        }
        catch (err) {
            console.error("Error adding travel story:", err);
            toast.error("Failed to add travel story. Please try again.");
        }
    }

    const handleAddOrUpdateClick = () => {
        console.log("Input data", { title, storyImg, story, visitedLocation, visitedDate })
        if (!title) {
            return setError("Please enter the title")
        }
        if (!story) {
            return setError("Please enter the story")
        }

        setError("")
        if (type === "edit") {
            updateTravelStory();
        }
        else {
            addNewTravelStory();
        }
    }


    const handleDeleteStoryImg = () => {

    }
    return (
        <div className='relative'>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                        {type === "add" ? (
                            <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                <MdAdd className='text-lg' />AddStory
                            </button>
                        ) : (
                            <>
                                <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                    <MdUpdate className='text-lg' />UpdateStory
                                </button>

                            </>
                        )}
                        <button className='' onClick={onClose}>
                            <MdClose className='text-xl text-slate-400' />
                        </button>
                    </div>
                    {error && (
                        <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                    )}
                </div>
            </div>
            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>Title</label>
                    <input type='text' className='text-2xl text-slate-950 outline-none'
                        placeholder='A Day at the Great Wall' value={title} onChange={({ target }) => setTitle(target.value)} />
                    <div className='my-3'>
                        <DateSelector date={visitedDate} setDate={setVisitedDate} />
                    </div>
                    <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
                    <div className='flex flex-col gap-2 mt-4'>
                        <label className='input-label'>Story</label>
                        <textarea
                            type="area"
                            className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                            placeholder='Your Story'
                            rows={10}
                            value={story}
                            onChange={({ target }) => setStory(target.value)}
                        />
                    </div>
                    <div className='pt-3'>
                        <label className='input-label'>Visited Locations</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default AddEditTravelStory