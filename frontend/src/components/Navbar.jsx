import React, { use } from 'react'
import LOGO from '../assets/images/logo.svg'
import ProfileInfo from './Cards/ProfileInfo'

const Navbar = ({ userInfo }) => {
    return (
        <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
            <div className='flex items-center'>
                <img src={LOGO} alt="Wander Notes" className='h-9' />
                <h4 className=''>WanderNotes</h4>

            </div>
            <ProfileInfo userInfo={userInfo} />
        </div>
    )
}

export default Navbar