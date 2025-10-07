export default function Offer() {
  return (
<section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Nagłówek */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Oferta
      </h2>

      {/* HStack: obraz + tekst */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10">
        {/* Obrazek z pomarańczowym boxem pod spodem */}
        <div className="relative w-full md:w-1/2 flex justify-center md:justify-start">
          {/* Pomarańczowe tło */}
          <div className="absolute bottom-[-12px] left-[12px] bg-orange-500 w-full max-w-lg h-64" />
          {/* Główny box / obrazek */}
          <div className="relative bg-gray-300 w-full max-w-lg h-96 shadow-lg z-10">
            {/* <Image src="/twoj-obrazek.jpg" alt="Oferta" fill className="object-cover rounded-md" /> */}
          </div>
        </div>

        {/* Tekst */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="text-center md:text-left flex flex-col justify-center w-full">
            <h3 className="text-xl md:text-3xl font-bold mb-4 lg:w-3/4">
              Obozy Które Rozwijają i Budują Pewność Siebie
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed lg:w-3/4">
              Obozy Akademii to projekt stworzony z myślą o młodych piłkarzach,
              którzy chcą aktywnie spędzać wolny czas, a przy okazji doskonalić
              swoje piłkarskie umiejętności.
            </p>
            <button className="px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition text-white font-medium w-fit mx-auto md:mx-0">
              Zapisz się
            </button>
          </div>
        </div>
      </div>
            {/* HStack: obraz + tekst */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 mt-16">

        {/* Tekst */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="text-center md:text-left flex flex-col justify-center w-full">
            <h3 className="text-xl md:text-3xl font-bold mb-4 lg:w-3/4">
              Obozy Które Rozwijają i Budują Pewność Siebie
            </h3>
            <p className="text-gray-700 mb-6 leading-relaxed lg:w-3/4">
              Obozy Akademii to projekt stworzony z myślą o młodych piłkarzach,
              którzy chcą aktywnie spędzać wolny czas, a przy okazji doskonalić
              swoje piłkarskie umiejętności.
            </p>
            <button className="px-6 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition text-white font-medium w-fit mx-auto md:mx-0">
              Zapisz się
            </button>
          </div>
        </div>
        {/* Obrazek z pomarańczowym boxem pod spodem */}
        <div className="relative w-full md:w-1/2 flex justify-center md:justify-start">
          {/* Pomarańczowe tło */}
          <div className="absolute bottom-[-12px] left-[-12px] bg-orange-500 w-full max-w-lg h-64" />
          {/* Główny box / obrazek */}
          <div className="relative bg-gray-300 w-full max-w-lg h-96 shadow-lg z-10">
            {/* <Image src="/twoj-obrazek.jpg" alt="Oferta" fill className="object-cover rounded-md" /> */}
          </div>
        </div>
      </div>
    </section>)};