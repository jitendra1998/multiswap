const Input = ({ token, balance }: { token: any; balance: number }) => {
  return (
    <div>
      <div className="relative mt-2 rounded-md">
        <input
          required
          type="text"
          name={token}
          id="price"
          className="block w-full rounded-md border-0 py-3 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0"
          aria-describedby="price-currency"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span
            className="text-gray-500 sm:text-sm pointer-events-none"
            id="price-currency"
          >
            {token}
          </span>
        </div>
      </div>
      <div className="flex justify-end px-2 py-2">
        <span className="text-sm  mr-2">Balance: {balance}</span>
        <button
        type="button"
        className="rounded-md bg-blue-400 px-2 py-0 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        max
      </button>
      </div>
    </div>
  );
};

export default Input;

