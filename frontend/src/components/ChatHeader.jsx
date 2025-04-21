import { X } from "lucide-react";
import { useAuthStore } from "../store/useStoreAuth";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-3 sm:p-4 border-b border-base-300 bg-base-100 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-8 sm:size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "avatar-placeholder.png"}
                alt={selectedUser.fullName}
                className="object-cover"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <h3 className="font-medium text-sm sm:text-base truncate">
              {selectedUser.fullName}
            </h3>
            <p className="text-xs sm:text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close Button (visible only on small screens) */}
        <button
          onClick={() => setSelectedUser(null)}
          className="lg:hidden text-zinc-500 hover:text-zinc-800 transition"
          aria-label="Close Chat"
        >
          <X className="size-5 sm:size-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
