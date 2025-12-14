"use client"

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react';
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, User } from 'lucide-react'
import React, { useState } from 'react'

const suggestions = [
    {
        label: "Dashboard",
        prompt: "Create an analytics dashboard to track customers and revenue data for a SaaS.",
        icon: LayoutDashboard,
    },
    {
        label: "Signup Form",
        prompt: "Create a modern sign-up form with email/password fields, Google and GitHub login options, and a terms checkbox.",
        icon: Key,
    },
    {
        label: "Hero",
        prompt: "Create a modern header and centered hero section for a productivity SaaS. Include a badge for a feature announcement and a title with a subtle gradient effect.",
        icon: HomeIcon,
    },
    {
        label: "User Profile Card",
        prompt: "Create a modern user profile card component for a social media website.",
        icon: User,
    },
];


const Hero = () => {

    const [userInput, setUserInput] = useState<string>()
    return (
        <div className='flex  flex-col items-center h-[80vh] justify-center'>
            {/* Header and Description */}

            <h2 className='font-bold text-6xl'>What should we Design?</h2>
            <p className='mt-2 text-gray-600 text-xl'>Generate, Edit and Explore desig with AI, Export code as well</p>

            {/* Input box */}
            <div className='w-full max-w-2xl p-5 border mt-5 rounded-xl'>
                <textarea placeholder='Describe your page design'
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className='w-full h-24 focus:outline-none focus:ring-0 resize-none'
                ></textarea>
                <div className='flex justify-between items-center'>
                    <Button variant={'ghost'}><ImagePlus /></Button>
                    <SignInButton mode='modal' forceRedirectUrl={"/workspace"}>

                        <Button disabled={!userInput}><ArrowUp /></Button>
                    </SignInButton>
                </div>
            </div>

            {/* Suggestion List */}

            <div className='flex mt-4 gap-4'>
                {suggestions.map((suggestion, index) => (
                    <Button
                        onClick={() => setUserInput(suggestion.prompt)}
                        key={index} variant={'outline'}>
                        <suggestion.icon />
                        {suggestion.label}</Button>
                ))}
            </div>
        </div>
    )
}

export default Hero