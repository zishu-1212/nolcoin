import React from "react";

const AirportSearch = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div className="space-y-6 mt-8">
      <div className="text-[#A3B0D1] text-center font-semibold flex justify-between">
        <p> </p>
        <p> Airport Code</p>
        <a
          target="blank"
          href="https://www.world-airport-codes.com/"
          className="text-red "
          style={{ fontSize: "13px", color: "red" }}
        >
          {" "}
          Find Your Code !
        </a>
      </div>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {/* <input
          type="text"
          name="name"
          placeholder="Enter Full airport name"
          value={formData.name || ""}
          onChange={handleChange}
          className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
        />
        <input
          type="text"
          name="country"
          placeholder="City,Country"
          value={formData.country || ""}
          onChange={handleChange}
          className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
        /> */}
        <input
          type="text"
          name="IATA"
          placeholder="3 Letter IATA Code"
          value={formData.IATA}
          onChange={handleChange}
          className="w-full bg-[#222B55] rounded-md py-2 px-3 text-[#A3B0D1] placeholder-[#A3B0D1] text-sm font-semibold focus:outline-none"
        />
        <button
          type="submit"
          className="w-full bg-[#4B5FD3] rounded-md py-2 text-white font-semibold text-sm"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default AirportSearch;
