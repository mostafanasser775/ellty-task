import { CheckBoxCheckedIcon } from "../icons";
import Checkbox from "../components/task-1/checkbox";
import CheckboxGroup from "../components/task-1/checkbox-group";

export default function Task1Page() {
    const pages = [
        { id: 'check-200', label: 'page 1' },
        { id: 'check-500', label: 'page 2' },
        { id: 'check-600', label: 'page 3' },
        { id: 'check-700', label: 'page 4' }
    ];

    return (
        <div className="bg-gray-100">
            <div className="container mx-auto py-20 px-4 grid lg:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                {/*Section 1*/}

                <section>

                    <h2 className="text-2xl font-bold text-black">Button</h2>
                    <div className="flex flex-col gap-6 mt-10">

                        <button className="rounded bg-primary text-[14px] cursor-pointer w-[340px] px-4 py-2 text-black hover:bg-[#FFD84D]">Done</button>
                        <button className="rounded bg-[#FFD84D] text-[14px] cursor-pointer w-[340px] px-4 py-2 text-black hover:bg-primary">Done</button>
                    </div>
                </section>
                <section>

                    <h2 className="text-2xl font-bold text-black">Desktop</h2>
                    <div className="flex flex-col gap-6 mt-10">

                        <Checkbox id="check-1" className="checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30" />

                        <Checkbox id="check-2" checked={true} className="checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30" />

                        <Checkbox id="check-3" className="checked:bg-[#fff]" />

                        <Checkbox id="check-4" disabled={true} className="checked:bg-[#fff]" />

                        <Checkbox id="check-6" checked={true} disabled={true} className="checked:bg-[#2469F6] bg-[#2469F6] checked:border-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]" />

                    </div>
                </section>
                <section>

                    <h2 className="text-2xl font-bold text-black">Home</h2>
                    <div className="flex flex-col gap-6 mt-10">
                        <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                            <h2 className="text-[14px] text-black">All pages</h2>
                            <Checkbox id="check-10" className="checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30" />
                        </div>

                        <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                            <h2 className="text-[14px] text-black">All pages</h2>
                            <Checkbox id="check-20" checked={true} className="checked:bg-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]/30" />
                        </div>

                        <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                            <h2 className="text-[14px] text-black">All pages</h2>
                            <Checkbox id="check-30" className="checked:bg-[#fff]" />
                        </div>

                        <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                            <h2 className="text-[14px] text-black">All pages</h2>
                            <Checkbox id="check-40" disabled={true} className="checked:bg-[#fff]" />
                        </div>

                        <div className="flex justify-between gap-4 w-full bg-white rounded p-4 items-center">
                            <h2 className="text-[14px] text-black">All pages</h2>
                            <Checkbox id="check-6" checked={true} disabled={true} className="checked:bg-[#2469F6] bg-[#2469F6] checked:border-[#2469F6] checked:border-[#2469F6] focus:ring-[#2469F6]" />
                        </div>

                    </div>
                </section>
                <section>

                    <h2 className="text-2xl font-bold text-black">Home</h2>
                    <div className="mt-10">
                        <CheckboxGroup pages={pages} />
                    </div>
                </section>
            </div>

        </div>
    );
}