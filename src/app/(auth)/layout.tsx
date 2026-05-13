import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className='bg-[#F4F5FA]'>{children}</div>
    </div>
  );
};

export default layout;
