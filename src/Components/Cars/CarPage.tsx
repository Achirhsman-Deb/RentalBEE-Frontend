import React, { useEffect, useState } from 'react';
import CarCard, { Car } from './CarCard';
import Modal from '../../Modals/Modal';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAlert } from '../AlertProvider';
import Button from '../Button';


interface CarPageProps {
    cars: Car[];
}
const CarPage: React.FC<CarPageProps> = ({ cars }: { cars: Car[] }) => {
    const navigate = useNavigate();
    const myAlert = useAlert();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Car>();

    const { user } = useSelector((state: RootState) => state.auth);
    const [loggedin, setloggedin] = useState<boolean>(false);
    useEffect(() => {
        if (user) {
            setloggedin(true);
            localStorage.setItem("user_data", JSON.stringify(user));
        } else setloggedin(false);
    }, [user]);

    const handleBookClick = (car: Car) => {
        setSelectedCar(car);
        if (loggedin){
            navigate(`/cars/car-booking/${car.carId}`);
        }else{
            myAlert(
              {
                type: "error",
                title: "You are not logged in!",
                subtitle: "To continue booking a car, you need to log in or create an account",
                buttons: [<Button type={"outline"} onClick={() => { }} >Cancel</Button>, <Button type={"filled"} onClick={() => navigate('/login')}>Log in</Button>]
              }
            )
        }
    };

    const handleDetailsClick = (car: Car) => {
        setSelectedCar(car);
        setModalOpen(true)
    };

    return (<>

        {!cars.length &&
            <div className="flex justify-center items-center h-40 text-gray-medium text-2xl font-semibold">
                <p>No cars found! Please try again later.</p>
            </div>
        }
        <div className="flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">

                {cars.map((car) => (

                    <CarCard
                        key={car.carId}
                        car={car}
                        onBookClick={handleBookClick}
                        onDetailsClick={handleDetailsClick}

                    />

                ))}

            </div>
            <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} car={selectedCar ? selectedCar : null} />
        </div>
    </>
    );
};

export default CarPage;


