import React from "react";

interface PersonalInfoProps {
    info: {
        name: string|undefined;
        email: string;
        phone: string;
    };
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ info }) => {
    return (
        <>
            <h2 className="text-2xl font-semibold mb-3">Personal info</h2>
            <div className="mb-6 border-[2px] border-black p-3 rounded-md text-sm">
                <p className="text-black font-md mb-2">{info.name}</p>
                <p className="text-gray-500 font-sm">{info.email}</p>
                <p className="text-gray-500 font-sm">{info.phone}</p>
            </div>
        </>
    );
};

export default PersonalInfo;
