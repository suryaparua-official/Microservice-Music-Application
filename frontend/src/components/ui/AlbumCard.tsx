import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard = ({ image, name, desc, id }: AlbumCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/album/" + id)}
      className="group flex flex-col gap-3 p-3 rounded-xl bg-surface
                 hover:bg-elevated cursor-pointer transition-colors duration-200
                 min-w-[160px] w-[160px]"
    >
      <div className="relative w-full aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        <div
          className="absolute inset-0 rounded-lg bg-black/40
                     flex items-end justify-end p-2
                     opacity-0 group-hover:opacity-100
                     transition-opacity duration-200"
        >
          <div
            className="w-10 h-10 bg-accent rounded-full flex items-center justify-center
                       shadow-lg translate-y-2 group-hover:translate-y-0
                       transition-transform duration-200"
          >
            <FaPlay size={12} className="text-black ml-0.5" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{name}</p>
        <p className="text-xs text-dim truncate">{desc}</p>
      </div>
    </div>
  );
};

export default AlbumCard;
