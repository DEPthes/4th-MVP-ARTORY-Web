import React from "react";
import { cn } from "../../utils/classname";

interface Tab {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: Tab[];
  selectedTabId: string;
  onTabChange: (tabId: string) => void;
}

const TabMenu: React.FC<TabMenuProps> = ({
  tabs,
  selectedTabId,
  onTabChange,
}) => {
  return (
    <nav className="flex gap-x-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={cn(
            "p-[8px]",
            "flex items-center justify-center text-center",
            "focus:outline-none transition-colors",
            tab.id === selectedTabId
              ? "border-b-2 border-[#D32F2F] text-[#D32F2F] font-semibold"
              : "text-[#717478] font-normal hover:text-[#D32F2F]/70"
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabMenu;

// 직업별 탭 참고
// const artistTabs = [
//     { id: "artistNote", label: "작가노트" },
//     { id: "works", label: "작업" },
//     { id: "exhibition", label: "전시" },
//     { id: "contest", label: "공모전" },
//     { id: "archive", label: "아카이브" },
//   ];

//   const galleryTabs = [
//     { id: "exhibition", label: "전시" },
//     { id: "contest", label: "공모전" },
//     { id: "archive", label: "아카이브" },
//   ];

//   const collectorTabs = [
//     { id: "archive", label: "아카이브" },
//   ];
