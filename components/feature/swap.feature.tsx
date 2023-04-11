import {
  AMM_CONTRACT_ADDRESS,
  CDCX_CONTRACT_ADDRESS,
  DEF_CONTRACT_ADDRESS,
} from "../../constants/constants";
import { useContract, useSigner } from "wagmi";

import { AMM_ABI } from "../../abi/amm";
import { ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import { ERC20_ABI } from "../../abi/erc20";
import InputWithDropdown from "../elements/inputdropdown.component";
import { useRef } from "react";

const Swap = () => {
  const swapForm = useRef(null) as any;
  const zap = useRef(null) as any;
  const { data: signer, isError, isLoading } = useSigner();

  const ammContract = useContract({
    address: AMM_CONTRACT_ADDRESS,
    abi: AMM_ABI,
    signerOrProvider: signer,
  });

  const cdcxContract = useContract({
    address: CDCX_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    signerOrProvider: signer,
  });

  const defContract = useContract({
    address: DEF_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    signerOrProvider: signer,
  });

  const swapToken = async (event: any) => {
    event.preventDefault();
    try {
      const form = swapForm.current;
      if (ammContract)
        await ammContract.swap(CDCX_CONTRACT_ADDRESS, DEF_CONTRACT_ADDRESS, form["first"].value);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="py-5">
      <form ref={swapForm} onSubmit={swapToken}>
        <InputWithDropdown name={"first"} />
        <div className="flex justify-center py-2 mt-2">
          <ArrowsUpDownIcon className=" h-6 w-6" aria-hidden="true" />
        </div>
        <InputWithDropdown name={"second"} />
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
