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

const Liquidity = ({
  lpContract,
  ammContract,
  defContract,
  cdcxContract,
}: any) => {
  const { data: signer, isError } = useSigner();
  const { address } = useAccount();
  const [cdcxBalance, setCdcxBalance] = useState() as any;
  const [defBalance, setDefBalance] = useState() as any;
  const [lpBalance, setLPBalance] = useState() as any;

  const [isLoading, setIsLoading] = useState(false);
  const [updateState, setUpdateState] = useState (false);

  useEffect(() => {
    const getTotalToken = async (contract: any, setBalance: any) => {
      if (contract) {
        const cdcxTokens = await contract.balanceOf(address);
        setBalance(cdcxTokens.toNumber());
      }
    };
    if (cdcxContract && address) {
      getTotalToken(cdcxContract, setCdcxBalance);
      getTotalToken(defContract, setDefBalance);
      getTotalToken(lpContract, setLPBalance);
    }
  }, [cdcxContract, lpContract, defContract, updateState]);

  const liquidForm = useRef(null) as any;

  const addLiquidity = async (event: any) => {
    event.preventDefault();
    const form = liquidForm.current;
    setIsLoading(true);
    await getApproval(form["CDCX"].value, form["DEF"].value);
    if (ammContract){
      const tx = await ammContract.addLiquidity(form["CDCX"].value, form["DEF"].value);
      await tx.wait();
      setIsLoading(false);
    }
    form["CDCX"].value = '';
    form["DEF"].value = ''
    setUpdateState(true);
    return;
  };

  const getApproval = async (cdcxAmt: any, defAmt: any) => {
    if (cdcxContract) {
      const receipt = await cdcxContract.approve(AMM_CONTRACT_ADDRESS, cdcxAmt);
      await receipt.wait();
    }
    if (defContract) {
      const receipt = await defContract.approve(AMM_CONTRACT_ADDRESS, defAmt);
      await receipt.wait();
    }
  };

  const redeemLPToken = async () => {
    if (ammContract) {
      const tx = await lpContract.approve(AMM_CONTRACT_ADDRESS, 10);
      await tx.wait();
      const receipt = await ammContract.removeLiquidity(10);
      await receipt.wait();
      setUpdateState(true);
    }
  };

  return (
    <>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <form className="space-y-6" ref={liquidForm} onSubmit={addLiquidity}>
          <Input token="CDCX" balance={cdcxBalance} />
          <Input token="DEF" balance={defBalance} />

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? 'animate-pulse': ''} flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
            >
              {isLoading ? 'Adding Liquidity...' : 'Add Liquidity'}
            </button>
          </div>
        </form>
        <button
          type="button"
          disabled={isLoading}
          onClick={redeemLPToken}
          className="flex w-full justify-center rounded-md bg-white mt-4 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Redeem LP Token
        </button>
        <span className="text-gray-400 mt-1 flex justify-center text-sm">
          Available : {lpBalance}{" "}
        </span>
      </div>
    </>
  );
};

export default Liquidity;
