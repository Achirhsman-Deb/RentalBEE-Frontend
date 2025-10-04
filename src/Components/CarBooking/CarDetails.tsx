import React from "react";
import Button from "../Button";

interface carDataType {
    carData: {
        CarId: string,
        CarName: string,
        CarImage: string | undefined,
        Location: string,
        TotalPrice: string | number,
        DipositAmt: string
    };
    role: string;
    func: () => void;
    isDisabled: boolean;
    isLoading:boolean;
}

const carDefaultImage = 'https://www.buycarsonline.in/Images/default_car.jpg'

const CarDetails: React.FC<carDataType> = ({ carData, role, func, isDisabled,isLoading }) => {
    return (
        <div className="w-full md:w-[429px] bg-[#F0F0F0] p-4 rounded-lg">
            <img
                src={`${carData.CarImage ? carData.CarImage : carDefaultImage}`}
                alt="Car"
                className="w-full md:w-[416px] h-[200px] object-cover rounded-lg mb-4"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = carDefaultImage;
                }}
            />
            <h3 className="text-xl">{carData.CarName}</h3>
            <p className="text-gray-500 text-sm mb-4">{carData.Location}</p>
            <hr className="border-t-2 border-gray-300 mb-2" />
            <div className="flex flex-col sm:flex-row justify-between items-start md:items-center mb-4">
                <div className="flex flex-col md:justify-between w-full">
                    <div className="flex flex-row justify-between text-lg font-bold w-full md:w-auto mb-2 sm:mb-0">
                        <p>Total:</p>
                        <span>₹{carData.TotalPrice}</span>
                    </div>

                    <p className="text-sm text-gray-400 font-normal">
                        Deposit: <span>₹{carData.DipositAmt}</span>
                    </p>
                </div>
            </div>
            {role == 'booking' && (
                <Button type="filled" width="w-full" onClick={() => func()} disabled={isDisabled || isLoading}>
                    {isLoading ? "confirming reservation..." : "Confirm reservation"}
                </Button>
            )}
            {role == 'editing' && (
                <Button type="filled" width="w-full" onClick={() => func()} disabled={isDisabled}>
                    Save
                </Button>
            )}
        </div>
    );
};

export default CarDetails;
