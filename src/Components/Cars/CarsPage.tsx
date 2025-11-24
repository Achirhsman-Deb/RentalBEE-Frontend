import { useEffect, useState } from "react";
import { Car } from "./CarCard";
import axios from "axios";
import LazyCarCard from "./LazyCarCard";
import { ApiEndPoint } from "../../utils";
import CarPage from "./CarPage";
import Pagination from "../Pagination";

const CarsPage = ({ carFilter, pageSizeReady, pageSize }: any) => {
  const [data, setData] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCars = async () => {
    if (!pageSizeReady) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        ...carFilter,
        size: pageSize.toString(),
        page: page.toString(),
      }).toString();

      const url = `${ApiEndPoint}/cars?${params}`;
      const res = await axios.get(url);

      if (res.status !== 200) throw new Error("Failed to fetch cars");

      const { content = [], totalPages = 0 } = res.data;
      setData(content);
      setTotalPages(totalPages);
    } catch (err: any) {
      console.error("Fetch cars error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when dependencies change
  useEffect(() => {
    fetchCars();
  }, [page, carFilter, pageSizeReady, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [carFilter]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
        {loading && <LazyCarCard size={pageSize} />}
      </div>

      {!loading && !error && <CarPage cars={data} />}

      {error && (
        <div className="text-center text-red-500 mt-4">
          ⚠️ {error}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      )}
    </>
  );
};

export default CarsPage;
