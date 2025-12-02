export type Location={
    
    "locationAddress": string,
    "locationId": string,
    "locationImageUrl"?: string,
    "locationName"?: string
    
}
export type DropDownOption = {
    value: string;
    label: string;
}
export type FilterFormData = {
    pickupLocation: Location;
    dropoffLocation: Location;
    pickupDate: string;
    dropoffDate: string;
    carCategory: string;
    gearboxType: string;
    engineType: string;
    priceRange: number[];
}
export type User={
    "role"?: string,
    "userId":string,
    "imageUrl"?: string,
    "username": string,
    "email"?: string,
    "firstName"?: string,
    "lastName"?: string,
    "phoneNumber"?: string,
    "country"?: string,
    "city"?: string,
    "street"?: string,
    "postalCode"?: string,
    "status": string
}