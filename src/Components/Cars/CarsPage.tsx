/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Car } from "./CarCard";
import axios from "axios";
import LazyCarCard from "./LazyCarCard";
import { EndPoint } from "../../utils";
import CarPage from "./CarPage";
import Pagination from "../Pagination";

const CarsPage = ({ carFilter, pageSizeReady, pageSize }: any) => {
    const [data, setData] = useState<Car[]>([]); // The fetched car data is stored here
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // To be used if any error occurs during fetch
    const [page, setPage] = useState(1); // TO be used for pagination
    const [totalPages, setTotalPages] = useState(0);

    const fetchCars = async () => {
        if (loading && error) console.log();
        setLoading(true);
        setError(null);
        const requestBody = { ...carFilter, size: pageSize, page: page };
        const params = new URLSearchParams(requestBody).toString();
        const url = `${EndPoint}/cars?${params}`;
        // console.log("Fetching cars from URL:", url);
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 seconds

        await axios.get(url)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch cars");
                }
                return res.data;
            })
            .then(data => {
                const cars = data.content || [];
                setTotalPages(data.totalPages);
                // console.log("Fetched cars:", cars);
                setData(cars);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }


    useEffect(() => {
        if (pageSizeReady) {
            fetchCars();
        }
    }, [page, carFilter, pageSizeReady]);


    useEffect(() => {
        setPage(1);
    }, [carFilter]);


    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
                {loading && <LazyCarCard size={pageSize} />}
            </div>
            {!loading && <CarPage cars={data} />}
            {totalPages > 1 && (<Pagination totalPages={totalPages} currentPage={page} setCurrentPage={setPage} />)}
        </>
    );
};

export default CarsPage;
