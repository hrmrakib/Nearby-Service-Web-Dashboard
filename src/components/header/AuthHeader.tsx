import Image from "next/image";
import React from "react";

const AuthHeader = () => {
  return (
    <header className=' bg-white h-19 py-1'>
      <div className='w-[80%] mx-auto bg-white h-19 py-1'>
        <Image
          src='/nav-logo.png'
          width={600}
          height={400}
          alt='Nav Logo'
          className='w-70 h-16'
        />
      </div>
    </header>
  );
};

export default AuthHeader;
