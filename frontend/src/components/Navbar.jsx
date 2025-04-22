import React from 'react';
import LOGO from '../assets/images/logo.svg';
import exam from '../assets/images/logo2.png'
import ProfileInfo from './Cards/ProfileInfo';
import { useNavigate } from 'react-router-dom';
import SearchBar from './Input/SearchBar';

const Navbar = ({ userInfo, searchQuery, setSearchQuery, onSearchNote, handleClearSearch }) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () =>{
        if(searchQuery){
            onSearchNote(searchQuery);
        }
    };

    const onClearSearch = () =>{
        handleClearSearch();
        setSearchQuery("");
    };

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <img src={exam} alt="travel story" className="h-9 w-9 object-contain" />
                <p className="text-primary text-lg font-semibold">WanderNotes</p>
            </div>

            {isToken && (
                <>
                    <SearchBar 
                        value={searchQuery} 
                        onChange={({target}) =>{
                            setSearchQuery(target.value);
                        }}
                        handleSearch={handleSearch}
                        onClearSearch={onClearSearch}
                    />
                    <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
                </>
            )}
        </div>

    );
};

export default Navbar;
