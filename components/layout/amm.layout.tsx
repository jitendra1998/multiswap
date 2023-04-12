import {
  AMM_CONTRACT_ADDRESS,
  CDCX_CONTRACT_ADDRESS,
  DEF_CONTRACT_ADDRESS,
  LP_CDCX_CONTRACT_ADDRESS,
} from '../../constants/constants';
import { useAccount, useContract, useSigner } from "wagmi";

import { AMM_ABI } from '../../abi/amm';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ERC20_ABI } from '../../abi/erc20';
import Liquidity from "../feature/liquidity.feature";
import Swap from "../feature/swap.feature";
import { Tabs } from "flowbite-react";

const AMM = () => {
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

  const lpContract = useContract({
    address: LP_CDCX_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    signerOrProvider: signer,
  });

  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-slate-200 shadow w-1/3 ">
      <div className="py-2 px-5">
        <Tabs.Group style="underline" >
          <Tabs.Item active={true} title="SWAP" className="flex flex-col text-2xl">
            <Swap {...{lpContract , ammContract, defContract, cdcxContract}}/>
          </Tabs.Item>
          <Tabs.Item title="LIQUIDITY" className="flex flex-col">
            <Liquidity {...{lpContract , ammContract, defContract, cdcxContract}}/>
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default AMM;
