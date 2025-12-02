import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AppNotification } from "../slices/NotificationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { ReadNotifications, fetchNotifications } from "../slices/ThunkAPI/ThunkAPI";

interface Props {
  onDelete: (NotiId: string) => void;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  Notifications: AppNotification[];
}

const NotificationPanel: React.FC<Props> = ({ onDelete, onClose, triggerRef, Notifications }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Track expanded notifications
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, triggerRef]);

  const toggleExpand = (_id: string) => {
    setExpanded((prev) => ({ ...prev, [_id]: !prev[_id] }));
  };

  const HandleDeleteNoti = async(NotiId: string) => {
    const data = {
      token: user?.userId,
      NotiId: NotiId,
    };

    onDelete(NotiId);

    try {
      await dispatch(ReadNotifications(data)).unwrap();
      await dispatch(fetchNotifications()).unwrap();
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  return (
    <div
      ref={panelRef}
      className="
        absolute top-16 right-2
        w-[90vw] sm:w-80 md:w-96
        bg-[#FFFBEA] 
        shadow-xl rounded-xl border border-gray-200
        p-3 z-[70] animate-fadeIn
        overflow-hidden
      "
    >
      {Notifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No notifications
        </p>
      ) : (
        <ul className="space-y-3 max-h-[70vh] overflow-y-auto">
          {Notifications.map((notif) => {
            const isExpanded = expanded[notif._id];
            return (
              <li
                key={notif._id}
                className="
                  flex justify-between items-start
                  rounded-lg p-3
                  shadow-sm 
                  border border-black-100
                  transition-colors
                  cursor-default
                "
                onClick={() => toggleExpand(notif._id)}
              >
                <div className="flex-1 pr-2">
                  <h4 className="font-semibold text-sm text-gray-900">
                    {notif.title}
                  </h4>

                  {/* ✅ Fixed truncation without requiring Tailwind line-clamp */}
                  <p
                    className={`text-xs text-gray-700 text-left mt-1 break-words ${!isExpanded ? "overflow-hidden max-h-[2.5rem]" : ""
                      }`}
                  >
                    {notif.message}
                  </p>

                  <span className="text-[10px] text-gray-40 mt-1 block">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Modern cross button */}
                <button
                  className="
                    text-black
                    hover:bg-[#FFD60A]
                    hover:text-white
                    transition-colors
                    p-1
                    flex items-center justify-center
                    rounded-full
                  "
                  onClick={(e) => {
                    e.stopPropagation();
                    HandleDeleteNoti(notif._id);
                  }}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NotificationPanel;
