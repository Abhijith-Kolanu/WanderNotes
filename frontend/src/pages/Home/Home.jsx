import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [allStories, setAllStories] = useState([]);

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
        </>
    );
};

export default Home;
