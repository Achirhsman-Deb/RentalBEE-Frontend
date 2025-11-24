import React, { useEffect, useState } from 'react';
import FAQSection from '../Components/Home/FAQSection';
import AboutUs from '../Components/Home/AboutUs/AboutUs';
import FilterCars from '../Components/FilterCars';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../Components/Button';
import CarCard, { Car } from '../Components/Cars/CarCard';
import LazyCarCard from '../Components/Cars/LazyCarCard';
import Modal from '../Modals/Modal';
import CarsPage from '../Components/Cars/CarsPage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { useAlert } from '../Components/AlertProvider';
import { personalInfoGet } from '../slices/ThunkAPI/ThunkAPI';
import { setServiceLocationInfo } from '../slices/serviceLocationSlice';
import LocationSection from '../Components/Home/Location';
import { ApiEndPoint } from '../utils';
import axios, { AxiosError } from 'axios';


export type InitialFilterType = {
  pickupLocationId: string,
  dropoffLocationId: string,
  pickupDate: string,
  dropoffDate: string,
  carCategory: string,
  gearboxType: string,
  engineType: string,
  minPrice: number | string,
  maxPrice: number | string,
};

export const initialFormData = {
  pickupLocationId: "",
  dropoffLocationId: "",
  pickupDate: "",
  dropoffDate: "",
  carCategory: "",
  gearboxType: "",
  engineType: "",
  minPrice: 0,
  maxPrice: 1000,
};

type Location = {
  locationId: string | number;
  locationName: string;
  locationAddress: string;
  locationUrl: string;
};

const fallbackLocations: Location[] = [];

const Home: React.FC = () => {
  const [carFilter, setCarFilter] = useState<InitialFilterType | "">("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car>();
  const [popularCars, setPopularCars] = useState<Car[]>([]);
  const [pageSize, setPageSize] = useState(1); // TO be used for pagination
  const [pageSizeReady, setPageSizeReady] = useState<boolean>(false);
  const [locationData, setLocationData] = useState<Location[]>(fallbackLocations);
  const { user } = useSelector((state: RootState) => state.auth);
  const [loggedin, setloggedin] = useState<boolean>(false);
  const myAlert = useAlert();
  const dispatch = useDispatch<AppDispatch>();

  const handleBookClick = (car: Car) => {
    setSelectedCar(car);
    if (loggedin)
      navigate(`/cars/car-booking/${car.carId}`);
    else
      myAlert(
        {
          type: "error",
          title: "You are not logged in!",
          subtitle: "To continue booking a car, you need to log in or create an account",
          buttons: [

            <Button type={"outline"} onClick={() => { }} >Cancel</Button>, <Button type={"filled"} onClick={() => navigate('/login')}>Log in</Button>]
        }

      )
  };

  const handleDetailsClick = (car: Car) => {
    console.log("Car details:", car);
    setSelectedCar(car);
    setModalOpen(true)
  };

  const getPopularCars = async () => {
    try {
      const response = await axios.get(ApiEndPoint + "/cars/popular");
      return response.data.content;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      console.log(err.response?.data?.error || "Unknown Error");
    }
  };
  useEffect(() => {
    if (user) {
      const userId = user.userId;
      dispatch(personalInfoGet({ id: userId, token: user?.idToken + "" }));
      if (user?.role === "ADMIN") {
        navigate("/dashboard");
      }
      if (user?.role === "SUPPORT_AGENT") {
        navigate("/support-bookings");
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationResponse = await axios.get(`${ApiEndPoint}/home/locations`);

        const locationContent = locationResponse.data?.content;

        setLocationData(locationContent);

        dispatch(setServiceLocationInfo(locationContent.map((loc: any) => ({
          locationName: loc.locationName,
          locationId: loc.locationId,
        }))));
      } catch (err: any) {
        setLocationData(fallbackLocations);
        dispatch(setServiceLocationInfo(fallbackLocations.map((loc: any) => ({
          locationName: loc.locationName,
          locationId: loc.locationId,
        }))));
        console.error('Error fetching location data:', err);
      }
    };

    fetchLocationData();
  }, []);


  useEffect(() => {
    if (user) {
      setloggedin(true);
      localStorage.setItem("user", JSON.stringify(user));
    } else setloggedin(false);
  }, [user]);

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width < 640) setPageSize(4);         // mobile
      else if (width < 1280) setPageSize(6);   // laptop or tablet
      else if (width < 1440) setPageSize(8);   // laptop or tablet
      else setPageSize(10);                     // desktop
      setPageSizeReady(true);
    };

    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  });

  useEffect(() => {
    async function fetchPopularCars() {
      try {
        const cars = await getPopularCars();
        setPopularCars(cars.slice(0, 4));
      } catch (error) {
        // handle error
      }
    }
    fetchPopularCars();
  }, []);

  const MainContent = () => (
    <>
      {/* popular cars section  */}
      <div className="flex flex-col">
        <span className="text-[#666666] font-medium text-[22px] mb-5">(POPULAR CARS)</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6  justify-items-center">
          {popularCars && (
            popularCars.length === 0 ? (
              <LazyCarCard
                size={pageSize / 2}
              />
            ) : (
              popularCars.map((car) => (
                <CarCard
                  key={car.carId}
                  car={car}
                  onBookClick={handleBookClick}
                  onDetailsClick={handleDetailsClick}
                />
              ))
            ))
          }
        </div>
        <span className='flex flex-row-reverse '>
          <Button width='w-fit' size='large' type="underline" onClick={() => {
            setCarFilter({ ...initialFormData, minPrice: '', maxPrice: '' });
            navigate("/cars")
          }} >
            View All Cars
          </Button>
        </span>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} car={selectedCar ? selectedCar : null} />

      {/* AboutUs section */}
      <AboutUs />

      {/* LocationSection */}
      <LocationSection locations={locationData} />

      {/* FAQSection */}
      <FAQSection />
    </>
  );

  return (
    <div className='px-4 sm:px-6 md:px-10 py-0 sm:py-6 md:py-6'>
      <FilterCars setCarFilter={setCarFilter} />
      {
        (location.pathname === "/cars") ?
          <CarsPage carFilter={carFilter} pageSizeReady={pageSizeReady} pageSize={pageSize} /> :
          <MainContent />
      }

    </div>
  );
};

export default Home;
