interface DisplayEntryProps {
  year: string;
  text: string;
}

const DisplayEntry: React.FC<DisplayEntryProps> = ({ year, text }) => {
  return (
    <div className="flex items-center space-x-6 bg-white">
      <div className="w-10 font-asta font-medium">{year || "yyyy"}</div>
      <div className="font-asta font-thin w-full">{text || "내용 없음"}</div>
    </div>
  );
};

export default DisplayEntry;
