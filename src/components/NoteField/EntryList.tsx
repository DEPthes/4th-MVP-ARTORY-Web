import React, { useState } from "react";
import EntryRow from "./EntryRow";
import RowPlusIcon from "../../assets/rowPlus.svg?react";

interface Entry {
  id: number;
  year: string;
  text: string;
  registered: boolean;
}

interface EntryListProps {
  placeholder?: string;
}

const EntryList: React.FC<EntryListProps> = ({
  placeholder = "내용을 입력하세요",
}) => {
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, year: "", text: "", registered: false },
  ]);

  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      { id: Date.now(), year: "", text: "", registered: false },
    ]);
  };

  const updateEntry = (id: number, data: Partial<Entry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...data } : entry))
    );
  };

  const deleteEntry = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {entries.map(({ id, year, text, registered }) => (
        <EntryRow
          key={id}
          year={year}
          text={text}
          isRegistered={registered}
          onYearChange={(y) => updateEntry(id, { year: y })}
          onTextChange={(t) => updateEntry(id, { text: t })}
          onRegister={() => updateEntry(id, { registered: true })}
          onDelete={() => deleteEntry(id)}
          placeholder={placeholder}
        />
      ))}
      <button
        onClick={addEntry}
        className="flex justify-center items-center w-10 h-10 p-2.5 bg-[#D32F2F] rounded-md cursor-pointer"
      >
        <RowPlusIcon />
      </button>
    </div>
  );
};

export default EntryList;
