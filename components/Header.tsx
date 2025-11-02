
import React from 'react';
import { JoystickIcon } from './icons/JoystickIcon';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-12">
            <div className="inline-flex items-center justify-center">
                 <JoystickIcon className="w-8 h-8 md:w-12 md:h-12 text-yellow-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]" />
                 <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mx-4" style={{ textShadow: '0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff00de, 0 0 30px #ff00de, 0 0 40px #ff00de, 0 0 55px #ff00de, 0 0 75px #ff00de' }}>
                    RETRO HUB
                </h1>
                <JoystickIcon className="w-8 h-8 md:w-12 md:h-12 text-yellow-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.7)]" />
            </div>
        </header>
    );
};

export default Header;
