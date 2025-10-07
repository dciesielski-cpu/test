"use client";
import React from "react";
import Gallery from "./components/Gallery";
import Hero from "./components/Hero";
import Offer from "./components/Offer";
import News from "./components/News";
import Testimonials from "./components/Testimonials";
import Form from "./components/Form";

export default function Page() {
  return (

    <main className="w-full flex flex-col items-center">
    <Hero />
    <Offer />
    <News />
    <Gallery />
    <Testimonials />
    <Form />
    </main>
  );
}
