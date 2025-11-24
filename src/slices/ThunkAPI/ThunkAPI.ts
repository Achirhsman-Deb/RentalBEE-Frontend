import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { Booking, BookingStatus, EditBookingPayload } from "../../types/BookingTypes";
import { ApiEndPoint } from "../../utils";
import { ExportReportPayload, ReportData, ReportFilters } from "../../types/ReportTypes";
import { AppNotification } from "../NotificationSlice";

export interface SingleDocument {
  documentUrl: string | null;
  status: string;
  fileName: string | null;
  fileSize: string | null;
}

export interface UserDocumentsResponse {
  success: boolean;
  message: string;
  data: {
    AadhaarCard: SingleDocument;
    DrivingLicense: SingleDocument;
  };
}

export interface UserDocumentsParams {
  userId: string;
  token: string;
}

export interface DocumentStatus {
  AadhaarCard: string;
  DrivingLicense: string;
}

export interface UserWithDocuments {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  documents: DocumentStatus;
}

export interface FetchUsersResponse {
  success: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  count: number;
  data: UserWithDocuments[];
}

export interface FetchUsersParams {
  status?: "ALL" | "VERIFIED" | "UNVERIFIED";
  page?: number;
  limit?: number;
  token: string | undefined;
}

interface ReservationData {
  token: string;
  carId: string;
  clientId: string;
  pickupDateTime: string;
  dropOffDateTime: string;
  pickupLocationId: string;
  dropOffLocationId: string;
}

interface FetchClientReviewsPayload {
  carId: string;
  page?: number;
  size?: number;
  sort?: string;
  direction?: string;
}

export interface BookingDetailsPayload {
  bookingId: string;
  token: string;
}

interface cancelDataType {
  bookingId: string;
  userId: string;
  token: string;
}

interface FetchBookingsArgs {
  UserId: string;
  token: string;
}

interface noti {
  token: string | undefined;
  NotiId: string;
}

export interface FeedbackPayload {
  bookingId: string;
  carId: string;
  clientId: string;
  feedbackText: string;
  rating: string;
  token: string;
}

type BookingApiItem = {
  bookingId: string;
  bookingStatus: string;
  carId: string;
  carImageUrl: string;
  carModel: string;
  orderDetails: string;
};

const statusMap: Record<string, BookingStatus> = {
  BOOKED: 'booked',
  RESERVED: 'reserved',
  SERVICESTARTED: 'serviceStarted',
  SERVICEPROVIDED: 'serviceProvided',
  SERVICEFINISHED: 'serviceFinished',
  CANCELED: 'canceled',
};

export const confirmReservation = createAsyncThunk(
  "booking/confirmReservation",
  async (data: ReservationData, { rejectWithValue }) => {
    try {
      const { token, ...bookingData } = data;
      const response = await axios.post(ApiEndPoint + "/bookings/", bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log(response)
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ success: boolean; error: { message: string; code: string } }>;

      if (err.response?.data) {
        return rejectWithValue(err.response.data.error);
      }

      return rejectWithValue({ message: err.message || "Unknown error", code: "CLIENT_ERROR" });
    }
  }
);

export const fetchBookings = createAsyncThunk<Booking[], FetchBookingsArgs>(
  "booking/fetchBookings",
  async ({ UserId, token }, { rejectWithValue }) => {
    try {
      const res = await axios.get<{ content: BookingApiItem[] }>(
        ApiEndPoint + `/bookings/${UserId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (res.status === 204) {
        return []; // no bookings
      }

      return res.data.content.map((item) => {
        const normalizedStatus = statusMap[item.bookingStatus];
        const dateMatch = item.orderDetails.match(/\((.*?)\)/)?.[1];
        const fallbackSplit = item.orderDetails.split(" ");

        return {
          id: item.bookingId,
          carImage: item.carImageUrl,
          carId: item.carId,
          carName: item.carModel,
          orderId: fallbackSplit[0],
          date: dateMatch || fallbackSplit[1] || "",
          status: normalizedStatus,
        };
      });
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;

      return rejectWithValue(err.response?.data.error || 500);
    }
  }
);


export const getLocations = createAsyncThunk("locations/getLocations", async (_, thunkAPI) => {
  try {
    const response = await axios.get(ApiEndPoint + "/home/locations");
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch locations");
  }
});

export const getCarDetailsById = createAsyncThunk(
  "car/getCarDetailsById",
  async (carId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(ApiEndPoint + `/cars/${carId}`);
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue(err.response?.data || "Something went wrong");
    }
  }
);


export interface RegistrationData {
  firstName: string;
  email: string;
  password: string;
  lastName: string;
}

// AsyncThunkAction<any, RegistrationData, AsyncThunkConfig>
export const registerUser = createAsyncThunk('auth/sign-up',
  async (data: RegistrationData, { rejectWithValue }) => {
    try {
      // console.log(data);
      const response = await axios.post(ApiEndPoint + '/auth/sign-up', data);
      // console.log(response.data.message);
      return response.data.message;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      return rejectWithValue(err.response?.data?.error || 'Registration failed');
    }

  }
);

interface LoginData {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk("auth/sign-in", async (data: LoginData, { rejectWithValue }) => {
  try {
    const response = await axios.post(ApiEndPoint + "/auth/sign-in", data);
    console.log(response)
    return response.data.body;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || "Unknown Error");
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout-user",
  async (_, thunkAPI) => {
    // No API call, just immediately resolve
    try {
      return;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch locations");
    }
  }
);
interface ChangePasswordData {
  id: string;
  currentPassword: string;
  newPassword: string;
  token: string;
}

export const changePassword = createAsyncThunk("auth/change-passsword", async (data: ChangePasswordData, { rejectWithValue }) => {
  try {
    // console.log(ApiEndPoint + "/users/" + data.id + "/change-password");
    const response = await axios.put(
      ApiEndPoint + "/users/" + data.id + "/change-password",
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        }
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
});
interface PersonalInfoGetData {
  id: string;
  token: string;
}

export const personalInfoGet = createAsyncThunk("auth/personal-info", async (data: PersonalInfoGetData, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      ApiEndPoint + `/user/personal-info/${data.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return rejectWithValue(err.response?.data?.error || "Unknown Error");
  }
});
export interface PersonalInfoPutData {
  id: string;
  token: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  country: string;
  city: string;
  street: string;
  postalCode: string;
  imageFile?: File | null;
}

export const personalInfoPut = createAsyncThunk(
  "auth/personal-info-put",
  async (data: PersonalInfoPutData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      if (data.firstName) formData.append("firstName", data.firstName);
      if (data.lastName) formData.append("lastName", data.lastName);
      if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
      if (data.country) formData.append("country", data.country);
      if (data.city) formData.append("city", data.city);
      if (data.street) formData.append("street", data.street);
      if (data.postalCode) formData.append("postalCode", data.postalCode);

      // Append file if user uploaded one
      if (data.imageFile) {
        formData.append("imageUrl", data.imageFile);
      }

      console.log(formData)

      const response = await axios.put(
        `${ApiEndPoint}/user/personal-info/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      return rejectWithValue(err.response?.data?.error || "Unknown Error");
    }
  }
);

export const fetchBookedDates = createAsyncThunk<
  string[],             // Return type
  string,               // carId as argument
  { rejectValue: string }  // Rejected value type
>(
  "car/fetchBookedDates",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ content: string[] }>(`${ApiEndPoint}/cars/${carId}/booked-days`);
      return response.data.content;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      return rejectWithValue(err.response?.data?.message || "Failed to fetch booked dates");
    }
  }
);

export const postFeedback = createAsyncThunk(
  "feedback/postFeedback",
  async (feedbackData: FeedbackPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ApiEndPoint}/feedbacks`, feedbackData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${feedbackData.token}`
        }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit feedback"
      );
    }
  }
);

export const fetchReportData = createAsyncThunk<ReportData[], ReportFilters, { rejectValue: string }>(
  "reports/fetchReportData",
  async (filters, { rejectWithValue }) => {
    try {
      const { token, ...queryParams } = filters;
      const response = await axios.get<{ content: ReportData[] }>(`${ApiEndPoint}/reports`, {
        params: queryParams,
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${filters.token}`
        },
      });
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reports");
    }
  }
);

export const exportReport = createAsyncThunk<string, ExportReportPayload, { rejectValue: string }>(
  "reports/exportReport",
  async ({ filters, extension }, { rejectWithValue }) => {
    try {
      const { token, ...queryParams } = filters;
      const response = await axios.post<{ url: string }>(`${ApiEndPoint}/reports/${extension}`, queryParams, {
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${filters.token}`
        },
      });
      return response.data.url;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to export report");
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (cancelData: cancelDataType, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ApiEndPoint}/bookings/cancel/${cancelData.bookingId}`,
        { userId: cancelData.userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cancelData.token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(
        error.response.data.message || 'Failed to cancel booking'
      );
    }
  }
);

export const getBookingDetails = createAsyncThunk(
  'bookings/getBookingDetails',
  async ({ bookingId, token }: BookingDetailsPayload, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}/bookings/details/${bookingId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch booking details'
      );
    }
  }
);


export const editBooking = createAsyncThunk(
  'booking/editBooking',
  async ({ bookingId, userId, token, updatedData }: EditBookingPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${ApiEndPoint}/bookings/edit/${bookingId}`,
        {
          userId,
          ...updatedData
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: 'Failed to update booking' });
    }
  }
);

export const fetchClientReviews = createAsyncThunk(
  'feedback/fetchClientReviews',
  async (
    { carId, page = 0, size = 10, sort = 'DATE', direction = 'DESC' }: FetchClientReviewsPayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${ApiEndPoint}/cars/${carId}/client-review`,
        {
          params: { page, size, sort, direction },
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch client reviews'
      );
    }
  }
);

// Upload document
export const uploadDocumentThunk = createAsyncThunk(
  "documents/upload",
  async ({
    userId,
    docType,
    file,
    token,
  }: { userId: string; docType: string; file: File; token: string }) => {
    const formData = new FormData();
    formData.append("document", file);

    const response = await axios.put(
      `${ApiEndPoint}/user/document/upload/${userId}/${docType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
);

// Get user documents
export const getDocumentsThunk = createAsyncThunk(
  "documents/get",
  async ({
    userId,
    token,
  }: { userId: string; token: string }) => {
    const response = await axios.get(`${ApiEndPoint}/user/document/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
);

export const fetchNotifications = createAsyncThunk<
  AppNotification[],
  string | undefined,
  { rejectValue: string }
>("notifications/fetchNotifications", async (token, { rejectWithValue }) => {
  try {
    const res = await axios.get<{ success: boolean; notifications: AppNotification[] }>(`${ApiEndPoint}/notifications/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.notifications;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch notifications"
    );
  }
});

export const ReadNotifications = createAsyncThunk<
  AppNotification,
  noti,
  { rejectValue: string }
>("notifications/readNotification", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.patch<{ success: boolean; notification: AppNotification }>(`${ApiEndPoint}/notifications/${data.NotiId}/read`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.token}`,
      },
    });
    return res.data.notification;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.error || "Failed to fetch notifications"
    );
  }
});

export const fetchUsersWithDocuments = createAsyncThunk<
  FetchUsersResponse, // Return type
  FetchUsersParams,   // Argument type
  { rejectValue: string } // Rejection type
>(
  "admin/fetchUsersWithDocuments",
  async ({ status = "ALL", page = 1, limit = 10, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get<FetchUsersResponse>(
        `${ApiEndPoint}/support/documents`,
        {
          params: { status, page, limit },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching users with documents:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);


export const fetchUserDocumentsById = createAsyncThunk<
  UserDocumentsResponse, // Return type
  UserDocumentsParams,   // Argument type
  { rejectValue: string } // Rejection type
>(
  "admin/fetchUserDocumentsById",
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get<UserDocumentsResponse>(
        `${ApiEndPoint}/support/documents/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error fetching user documents:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user documents"
      );
    }
  }
);

export const fetchSupportBookings = createAsyncThunk(
  "support_bookings/fetchAll",
  async (
    {
      status,
      page,
      limit,
      token,
    }: { status?: string; page?: number; limit?: number; token?: string },
    { rejectWithValue }
  ) => {
    try {
      const params: any = { page, limit };
      if (status && status !== "ALL") params.status = status;

      const response = await axios.get(`${ApiEndPoint}/support/get-bookings`, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

export const fetchSupportBookingById = createAsyncThunk(
  "support_bookings/fetchById",
  async ({ id, token }: { id: string; token?: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ApiEndPoint}/support/get-booking/${id}`, {
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      return response.data.booking;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch booking details");
    }
  }
);