import { useEffect, useState } from "react";
import Button from "./Button";
import DropDown from "./Inputs/DropDown";
import DualHandleSlider from "./Inputs/DualHandleSlider";
import { FilterFormData, Location } from "../types/types";
import { useLocation, useNavigate } from "react-router-dom";
import { EndPoint } from "../utils";
import { format } from "date-fns";


const gearboxTypes = [
    { value: 'AUTOMATIC', label: 'AUTOMATIC' },
    { value: 'MANUAL', label: 'MANUAL' },
];

const engineTypes = [
    { value: 'PETROL', label: 'PETROL' },
    { value: 'ELECTRIC', label: 'ELECTRIC' },
    { value: 'DIESEL', label: 'DIESEL' },
    { value: 'HYBRID', label: 'HYBRID' },
];

const categories = [
    { value: 'ECONOMY' , label: 'ECONOMY'},
    { value:'COMFORT', label: 'COMFORT'},
    { value:'BUSINESS', label: 'BUSINESS'},
    { value:'MINIVAN', label: 'MINIVAN'},
    { value:'PREMIUM', label: 'PREMIUM'},
    { value:'CROSSOVER', label: 'CROSSOVER'},
    { value:'ELECTRIC', label: 'ELECTRIC'},
]
async function fetchLocations(updateFun: (locations: Location[]) => void) {
    try {
        const response = await fetch(`${EndPoint}/home/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        updateFun(data.content);
    } catch (error) {
        console.error('Error fetching locations:', error);
        updateFun([]);
    }
}

export const initialFormData: FilterFormData = {
    pickupLocation: {
        locationId: "",
        locationAddress: "",
    },
    dropoffLocation: {
        locationId: "",
        locationAddress: "",
    },
    pickupDate: "",
    dropoffDate: "",
    carCategory: "",
    gearboxType: "",
    engineType: "",
    priceRange: [500, 6000],
};

const FilterCars = ({ setCarFilter }: any) => {
    const [formData, setFormData] = useState<FilterFormData>(
        () => {
            if (localStorage.getItem("carFilter") !== null)
                return localStorage.getItem("carFilter") ? JSON.parse(localStorage.getItem("carFilter")!) as FilterFormData : { ...initialFormData };
            else
                return { ...initialFormData }
        }
    );

    const [locations, setLocations] = useState<Location[]>([]);
    const navigate = useNavigate();
    const location = useLocation();

    function updateFormField<T extends keyof FilterFormData>(field: T, value: FilterFormData[T]) {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function clearData() {
        setFormData({ ...initialFormData });
    }

    function searchHandler() {
        const response: any = {};
        if (formData.pickupLocation?.locationId) {
            response.pickupLocationId = formData.pickupLocation.locationId;
        }
        if (formData.dropoffLocation?.locationId) {
            response.dropoffLocationId = formData.dropoffLocation.locationId;
        }
        if (formData.pickupDate) {
            response.pickupDateTime = formData.pickupDate;
        }
        if (formData.dropoffDate) {
            response.dropoffDateTime = formData.dropoffDate;
        }
        if (formData.carCategory) {
            response.category = formData.carCategory;
        }
        if (formData.gearboxType) {
            response.gearBoxType = formData.gearboxType;
        }
        if (formData.engineType) {
            response.fuelType = formData.engineType;
        }
        if (formData.priceRange) {
            response.minPrice = formData.priceRange[0];
            response.maxPrice = formData.priceRange[1];
        }
        localStorage.setItem("carFilter", JSON.stringify(formData));
        setCarFilter(response)
        if (!(location.pathname === "/cars")) navigate("/cars")
    }
    const formatDate = (date: string) => {
        try {
            return format(new Date(date), 'MMM dd'); // e.g. "Jun 20"}
        } catch (error) {
            return ""
        }
    }

    useEffect(() => {
        fetchLocations(setLocations);
    }, []);

    useEffect(() => {
        const response: any = {};
        if (formData.pickupLocation?.locationId) {
            response.pickupLocationId = formData.pickupLocation.locationId;
        }
        if (formData.dropoffLocation?.locationId) {
            response.dropoffLocationId = formData.dropoffLocation.locationId;
        }
        if (formData.pickupDate) {
            response.pickupDateTime = formData.pickupDate;
        }
        if (formData.dropoffDate) {
            response.dropoffDateTime = formData.dropoffDate;
        }
        if (formData.carCategory) {
            response.category = formData.carCategory;
        }
        if (formData.gearboxType) {
            response.gearBoxType = formData.gearboxType;
        }
        if (formData.engineType) {
            response.fuelType = formData.engineType;
        }
        if (formData.priceRange) {
            response.minPrice = formData.priceRange[0];
            response.maxPrice = formData.priceRange[1];
        }
        setCarFilter(response)
    }, []);


    return (
        <div className="bg-[#FFFBF3]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 mt-4">Choose a car for rental</h1>
            <div className="p-6 rounded-lg border-[1.35px] border-black mb-5 mt-7 right-0">
                <span className="flex flex-row-reverse -mt-6 mb-4">
                    <Button width="w-fit" type="underline" onClick={clearData} size="large">
                        Clear all filters
                    </Button>

                </span>
                <div className="grid sm:grid-cols-2 lg:grid-cols-[1.731fr_1.731fr_1fr_1fr] gap-4 ">
                    <DropDown
                        id="pickupLocation"
                        label="Pick-up location"
                        options={locations.map(location => ({
                            value: location.locationId,
                            label: location.locationAddress,
                        }))}
                        placeholder={formData.pickupLocation.locationAddress || "Choose location"}
                        onchange={value => updateFormField("pickupLocation", {
                            locationId: value[0] ?? "",
                            locationAddress: value[1] ?? "",
                        })}
                    />
                    <DropDown
                        id="dropoffLocation"
                        label="Drop-off location"
                        options={locations.map(location => ({
                            value: location.locationId,
                            label: location.locationAddress,
                        }))}
                        placeholder={formData.dropoffLocation.locationAddress || "Choose location"}
                        onchange={value => updateFormField("dropoffLocation", {
                            locationId: value[0] ?? "",
                            locationAddress: value[1] ?? "",
                        })}
                    />
                    <DropDown
                        id="pickupDate"
                        label="Pick-up date"
                        calendar
                        placeholder={formatDate(formData.pickupDate) || "Select Date"}
                        onchange={value => { updateFormField("pickupDate", value[0] ?? ""); updateFormField("dropoffDate", value[1] ?? "") }}
                    />
                    <DropDown
                        id="dropoffDate"
                        label="Drop-off date"
                        calendar
                        placeholder={formatDate(formData.dropoffDate) || "Select Date"}
                        onchange={value => { updateFormField("pickupDate", value[0] ?? ""); updateFormField("dropoffDate", value[1] ?? "") }}
                    />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-[0.298fr_0.298fr_0.298fr_0.391fr_0.311fr] gap-4 items-center mt-6">
                    <DropDown
                        id="carCategory"
                        label="Car category"
                        options={categories}
                        placeholder={formData.carCategory || "Choose category"}
                        onchange={value => updateFormField("carCategory", value[0] ?? "")}
                    />
                    <DropDown
                        id="gearboxType"
                        label="Gearbox"
                        options={gearboxTypes}
                        placeholder={formData.gearboxType || "Choose gearbox"}
                        onchange={value => updateFormField("gearboxType", value[0] ?? "")}
                    />
                    <DropDown
                        id="engineType"
                        label="Type of engine"
                        options={engineTypes}
                        placeholder={formData.engineType || "Choose engine type"}
                        onchange={value => updateFormField("engineType", value[0] ?? "")}
                    />
                    <div className="flex flex-col items-center lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-2 sm:col-start-1 sm:col-end-3 sm:row-start-2 sm:row-end-3 ">
                        <DualHandleSlider
                            label="Price per day"
                            sliderMin={500}
                            sliderMax={8000}
                            currMinValue={formData.priceRange[0]}
                            currMaxValue={formData.priceRange[1]}
                            onchange={(value: any) => updateFormField("priceRange", value)}
                        />
                    </div>
                    <div className="sm:col-span-1 md:col-span-1 flex items-center md:mt-6 sm:mt-6">
                        <Button type="filled" id="btn-find-car" onClick={searchHandler} >
                            Find a car
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterCars;