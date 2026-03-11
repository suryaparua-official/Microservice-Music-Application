import { useNavigate } from "react-router-dom";
import PlayListCard from "../ui/PlayListCard";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex lg:flex w-70 h-full p-3 flex-col gap-3 text-gray-200 overflow-hidden">
      <div className="bg-[#121212] rounded-lg p-4 flex flex-col gap-3">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer
                     hover:bg-[#1a1a1a] transition-colors duration-200"
        >
          <img src="/home.png" alt="Home" className="w-6 h-6 opacity-90" />
          <p className="font-semibold text-sm">Home</p>
        </div>

       <div
  onClick={() => navigate("/search")}
  className="flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer
             hover:bg-[#1a1a1a] transition-colors duration-200"
>
  <img src="/search.png" alt="Search" className="w-6 h-6 opacity-80" />
  <p className="font-semibold text-sm">Search</p>
</div>

      </div>

      <div className="bg-[#121212] flex-1 rounded-lg p-3 overflow-hidden">
        <div
          className="flex items-center justify-between px-3 py-2 rounded-md
                     hover:bg-[#1a1a1a] transition-colors duration-200 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src="/stack.png"
              className="w-5 h-5 opacity-80"
              alt="Library"
            />
            <p className="font-semibold text-sm">Your Library</p>
          </div>

          <div className="flex items-center gap-3">
            <img
              src="/plus.png"
              className="w-5 h-5 opacity-70 hover:opacity-100"
              alt="Add"
            />
            <img
              src="/arrow.png"
              className="w-5 h-5 opacity-70 hover:opacity-100"
              alt="Expand"
            />
          </div>
        </div>

        <div
          onClick={() => navigate("/playlist")}
          className="mt-2 cursor-pointer"
        >
          <PlayListCard />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
