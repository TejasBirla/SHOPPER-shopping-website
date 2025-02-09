import React from "react";
import Hero from "../Components/Hero/hero";
import Popular from "../Components/Popular/popular";
import Offer from "../Components/Offers/Offer";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";

export default function Shop() {
  return (
    <div className="shop">
      <Hero />
      <Popular />
      <Offer />
      <NewCollections />
      <NewsLetter />
    </div>
  );
}
