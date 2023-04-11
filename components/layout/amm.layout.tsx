import Liquidity from "../feature/liquidity.feature";
import Swap from "../feature/swap.feature";
import { Tabs } from "flowbite-react";

const AMM = () => {
  return (
    <div className="divide-y divide-gray-200 overflow-hidden rounded-lg bg-slate-50 shadow w-1/3 ">
      <div className="py-2 px-5">
        <Tabs.Group style="underline" className="">
          <Tabs.Item active={true} title="SWAP" className="flex flex-col text-2xl">
            <Swap/>
          </Tabs.Item>
          <Tabs.Item title="LIQUIDITY" className="flex flex-col">
            <Liquidity />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </div>
  );
};

export default AMM;
