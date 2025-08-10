import React, { useState } from "react";
import EntryRow from "./EntryRow";
import RowPlusIcon from "../../assets/rowPlus.svg?react";

export interface Entry {
  id: number;
  year: string;
  text: string;
  registered?: boolean;
}

interface EntryListProps {
  entries: Entry[];
  onChange: (newEntries: Entry[]) => void;
  placeholder?: string;
  className?: string;
}

const EntryList: React.FC<EntryListProps> = ({
  entries,
  onChange,
  placeholder = "내용을 입력하세요",
}) => {
  const addEntry = () => {
    const newEntry: Entry = {
      id: Date.now(),
      year: "",
      text: "",
      registered: false,
    };
    onChange([...entries, newEntry]);
  };

  const updateEntry = (id: number, data: Partial<Entry>) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, ...data } : entry
    );
    onChange(updatedEntries);
  };

  const deleteEntry = (id: number) => {
    const filteredEntries = entries.filter((entry) => entry.id !== id);
    onChange(filteredEntries);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {entries.map(({ id, year, text, registered }) => (
        <EntryRow
          key={id}
          year={year}
          text={text}
          isRegistered={registered ?? false}
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
