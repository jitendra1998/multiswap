import {
  AMM_CONTRACT_ADDRESS,
  CDCX_CONTRACT_ADDRESS,
  DEF_CONTRACT_ADDRESS,
} from "../../constants/constants";
import { useContract, useSigner } from "wagmi";

import { AMM_ABI } from "../../abi/amm";
import { ERC20_ABI } from "../../abi/erc20";
import Input from "../elements/input.component";
import { useRef } from "react";

const Liquidity = () => {
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

  const liquidForm = useRef(null) as any;

  const addLiquidity = async (event: any) => {
    event.preventDefault();
    const form = liquidForm.current;

    await getApproval(form["CDCX"].value, form["DEF"].value);
    if (ammContract)
      await ammContract.addLiquidity(form["CDCX"].value, form["DEF"].value);
    return;
  };

  const getApproval = async (cdcxAmt: any, defAmt: any) => {
    if (cdcxContract) await cdcxContract.approve(AMM_CONTRACT_ADDRESS, cdcxAmt);
    if (defContract) await defContract.approve(AMM_CONTRACT_ADDRESS, defAmt);
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <form className="space-y-6" ref={liquidForm} onSubmit={addLiquidity}>
        <Input token="CDCX" balance={3000} />
        <Input token="DEF" balance={2000} />

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Liquidity
          </button>
        </div>
      </form>
    </div>
  );
};

export default Liquidity;
