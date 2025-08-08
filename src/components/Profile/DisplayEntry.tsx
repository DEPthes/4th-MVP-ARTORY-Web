interface DisplayEntryProps {
  year: string;
  text: string;
}

const DisplayEntry: React.FC<DisplayEntryProps> = ({ year, text }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-23.5 h-13.5 font-asta font-medium rounded-md px-7 py-4 bg-[#EAEBED]">
        {year || "yyyy"}
      </div>
      <div className="font-asta font-thin w-full h-13.5 bg-[#F4F5F6] rounded-md px-5.5 py-4">
        {text || "내용 없음"}
      </div>
    </div>
  );
};

export default DisplayEntry;
