"use client";

import { useState } from "react";
import { CheckBoxCheckedIcon } from "../../icons";

interface CheckboxGroupProps {
    pages: { id: string; label: string }[];
    className?: string;
}

export default function CheckboxGroup({ pages, className = "" }: CheckboxGroupProps) {
    const [allPagesChecked, setAllPagesChecked] = useState(false);
    const [pageStates, setPageStates] = useState<Record<string, boolean>>(
        pages.reduce((acc, page) => ({ ...acc, [page.id]: false }), {})
    );

    const handleAllPagesChange = (checked: boolean) => {
        setAllPagesChecked(checked);
        const newPageStates = pages.reduce((acc, page) => ({ ...acc, [page.id]: checked }), {});
        setPageStates(newPageStates);
    };

    const handlePageChange = (pageId: string, checked: boolean) => {
        const newPageStates = { ...pageStates, [pageId]: checked };
        setPageStates(newPageStates);
        
        // Update "All pages" based on individual page states
        const allIndividualPagesChecked = Object.values(newPageStates).every(state => state);
        setAllPagesChecked(allIndividualPagesChecked);
    };

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center border-b border-gray-200">
                <h2 className="text-[14px] text-black">All pages</h2>
                <label className="flex items-center cursor-pointer relative">
                    <input
                        type="checkbox"
                        checked={allPagesChecked}
                        onChange={(e) => handleAllPagesChange(e.target.checked)}
                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-slate-300 checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30"
                    />
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <CheckBoxCheckedIcon />
                    </span>
                </label>
            </div>

            {pages.map((page) => (
                <div key={page.id} className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                    <h2 className="text-[14px] text-black">{page.label}</h2>
                    <label className="flex items-center cursor-pointer relative">
                        <input
                            type="checkbox"
                            checked={pageStates[page.id]}
                            onChange={(e) => handlePageChange(page.id, e.target.checked)}
                            className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border-2 border-slate-300 checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30"
                        />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <CheckBoxCheckedIcon />
                        </span>
                    </label>
                </div>
            ))}
        </div>
    );
}
