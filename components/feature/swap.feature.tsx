import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import InputWithDropdown from "../elements/inputdropdown.component";
import { useRef } from "react";

const Swap = () => {
  const swapForm = useRef(null) as any;
  const zap = useRef(null) as any;
  
  const swapToken = (event: any) => {
    event.preventDefault();
    const form = swapForm.current;
    console.log(form['second'].value, form['first'].value);
  };
  return (
    <div className="py-5">
      <form ref={swapForm} onSubmit={swapToken}>
        <InputWithDropdown name={'first'}/>
        <div className="flex justify-center py-2 mt-2">
          <ArrowsUpDownIcon className=" h-6 w-6" aria-hidden="true" />
        </div>
        <InputWithDropdown name={'second'}/>
        <button
          type="submit"
          className="inline-flex w-full mt-4 justify-center items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          SWAP
        </button>
      </form>
    </div>
  );
};

export default Swap;
