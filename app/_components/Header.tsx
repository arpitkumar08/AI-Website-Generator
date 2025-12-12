import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import path from 'path'
import React from 'react'


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


            <Button>Get Started <ArrowRight /> </Button>
        </div>
    )
}

export default Header