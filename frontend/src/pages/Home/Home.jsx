import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import { MdAdd } from "react-icons/md"
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import Modal from "react-modal"
import AddEditTravelStory from './AddEditTravelStory';

const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);
    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null
    })

    // Fetch user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    // Fetch all travel stories
    const getAllTravelStories = async () => {
        try {
            const response = await axiosInstance.get("/get-all-stories");
            if (response.data && response.data.stories) {
                setAllStories(response.data.stories);
            }
        } catch (error) {
            console.log("An unexpected error occurred. Please try again.");
        }
    };

    // Handle editing a story
    const handleEdit = (item) => {
        console.log("Edit clicked for:", item);
        navigate(`/edit-story/${item._id}`);
    };

    // Handle viewing a story
    const handleViewStory = (item) => {
        console.log("View clicked for:", item);
        navigate(`/view-story/${item._id}`);
    };

    // Handle toggling favourite
    const updateIsFavourite = async (storyData) => {
        const storyId = storyData._id
        try {
            const response = await axiosInstance.put(`/update-is-favourite/${storyId}`, {
                isFavourite: !storyData.isFavourite,
            });

            // Update state
            if (response.data && response.data.story) {
                toast.success("Story updated Successfully")
                getAllTravelStories()
            }
        } catch (error) {
            console.error("Failed to update favourite status", error);
        }
    };

    useEffect(() => {
        getAllTravelStories();
        getUserInfo();
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} />
            <div className="container mx-auto py-10">
                <div className="flex gap-7">
                    <div className="flex-1">
                        {allStories.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {allStories.map((item) => (
                                    <TravelStoryCard
                                        key={item._id}
                                        imgUrl={item.imageUrl}
                                        title={item.title}
                                        story={item.story}
                                        date={item.visitedDate}
                                        visitedLocation={item.visitedLocation}
                                        isFavourite={item.isFavourite}
                                        onEdit={() => handleEdit(item)}
                                        onClick={() => handleViewStory(item)}
                                        onFavouriteClick={() => updateIsFavourite(item)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-500">No stories found.</div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        zIndex: 999
                    },
                }}
                appElement={document.getElementById("root")}
                className="model-box"
            >
                <AddEditTravelStory
                    type={openAddEditModal.type}
                    storyInfo={openAddEditModal.data}
                    onClose={() => {
                        setOpenAddEditModal({ isShown: false, type: "add", data: null })
                    }}
                    getAllTravelStories={getAllTravelStories}
                />
            </Modal>
            <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10' onClick={() => {
                setOpenAddEditModal({ isShown: true, type: "add", data: null })
            }}
            ><MdAdd className='text-[32px] text-white' /></button>
            <ToastContainer />
        </>
    );
};

export default Home;
