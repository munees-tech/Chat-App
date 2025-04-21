import { useChatStore } from '../store/useChatStore.js'
import Sidebar from '../components/Sidebar.jsx'
import NoChatSelected from '../components/NoChatSelected.jsx'
import ChatContainer from '../components/ChatContainer.jsx'

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-base-200 px-2 py-4 md:py-8">
      <div className="flex items-center justify-center">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl min-h-[80vh]">
          <div className="flex flex-col md:flex-row h-full rounded-lg overflow-hidden">
            <Sidebar />
            <div className="flex-1">
              {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
