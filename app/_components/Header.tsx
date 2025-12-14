"use client"

import { Button } from '@/components/ui/button'
import { SignInButton } from '@clerk/clerk-react'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'



const MenuOptions = [
    {
        name: 'Pricing',
        path: '/pricing'
    },
    {
        name: 'Contact',
        path: '/contact'
    },
]

const Header = () => {
    return (
        <div className='flex justify-between items-center shadow-md p-4'>
            {/* Logo */}

            <div className='flex gap-2 items-center'>
                <Image
                    src={'/logo.svg'}
                    alt='logo'
                    width={35}
                    height={35}
                />
                <h2 className='font-bold text-xl'>AI Website Generator</h2>

            </div>


            {/* Menu Options */}
            <div className='flex gap-3'>
                {MenuOptions.map((menu, index) => (
                    <Button variant={'ghost'} key={index}>{menu.name}</Button>
                ))}
            </div>

            {/* Get Started */}

            <SignInButton mode='modal' forceRedirectUrl={"/workspace"}>


                <Button>Get Started <ArrowRight /> </Button>
            </SignInButton>
        </div>
    )
}

export default Header