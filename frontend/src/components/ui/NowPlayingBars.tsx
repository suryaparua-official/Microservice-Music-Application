const NowPlayingBars = () => (
  <div className="flex items-end gap-[2px] h-4 w-4">
    <span className="w-[3px] bg-accent rounded-sm playing-bar-1" />
    <span className="w-[3px] bg-accent rounded-sm playing-bar-2" />
    <span className="w-[3px] bg-accent rounded-sm playing-bar-3" />
  </div>
);

export default NowPlayingBars;
