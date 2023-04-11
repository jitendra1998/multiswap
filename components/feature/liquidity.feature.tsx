import {
  AMM_CONTRACT_ADDRESS,
  CDCX_CONTRACT_ADDRESS,
  DEF_CONTRACT_ADDRESS,
  LP_CDCX_CONTRACT_ADDRESS,
} from "../../constants/constants";
import { useAccount, useContract, useSigner } from "wagmi";

import { AMM_ABI } from "../../abi/amm";
import { ERC20_ABI } from "../../abi/erc20";
import Input from "../elements/input.component";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const Liquidity = () => {
  const { data: signer, isError, isLoading } = useSigner();
  const { address } = useAccount();
  const [cdcxBalance, setCdcxBalance] = useState() as any;
  const [defBalance, setDefBalance] = useState() as any;
  const [lpBalance, setLPBalance] = useState() as any;
  

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

  const lpContract = useContract({
    address: LP_CDCX_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    async function getTotalToken(contract: any, setBalance: any) {
      if (contract) {
        const cdcxTokens = await contract.balanceOf(address);
        setBalance(cdcxTokens.toNumber());
      }
    }
    getTotalToken(cdcxContract, setCdcxBalance);
    getTotalToken(defContract, setDefBalance);
    getTotalToken(lpContract, setLPBalance);
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
    if (cdcxContract) {
      const receipt = await cdcxContract.approve(AMM_CONTRACT_ADDRESS, cdcxAmt);
      receipt.wait();
    }
    if (defContract) {
      const receipt = await defContract.approve(AMM_CONTRACT_ADDRESS, defAmt);
      receipt.wait();
    }
  };

  const redeemLPToken = async() => {
    if(ammContract){
      await ammContract.removeLiquidity();
    }
  }

  return (
    <>

    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
     
      <form className="space-y-6" ref={liquidForm} onSubmit={addLiquidity}>
        
        <Input token="CDCX" balance={cdcxBalance} />
        <Input token="DEF" balance={defBalance} />

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Liquidity
          </button>
        </div>
      </form>
      <button
            type="button"
            onClick={redeemLPToken}
            className="flex w-full justify-center rounded-md bg-white mt-4 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Redeem LP Token 
          </button>
          <span className="text-gray-400 mt-1 flex justify-center text-sm">Available : {lpBalance} </span>
    </div>
    </>
  );
};

export default Liquidity;
