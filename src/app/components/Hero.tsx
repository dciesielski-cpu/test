import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";


export default function Hero() {
  const [play, setPlay] = useState(false);

  // 🔑 przykład — podmień ID na swój filmik
  const videoId = "dQw4w9WgXcQ";
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
          <section className="relative w-full max-w-7xl mx-auto px-4 py-6">
      <div className="relative w-full h-[450px] md:h-[650px] lg:h-[700px] rounded-2xl overflow-hidden">
        {/* Tło - obrazek */}
        <Image
          src="/hero-placeholder.jpg" // <- podmień na swoje zdjęcie
          alt="Hero"
          fill
          className="object-cover"
        />

        {/* Nakładka dla lepszej czytelności */}
        <div className="absolute inset-0 bg-black/20" />

      {/* Tekst wyśrodkowany */}
      <h1 className="
        flex 
        absolute inset-0 
        items-center justify-center text-center leading-relaxed
        text-white text-3xl md:text-5xl font-bold drop-shadow-md px-4
        h-[100%] md:h-[calc(100%-13rem)] "
      >
        Zajęcia, Które Rozwijają <br /> i Budują Pewność Siebie
      </h1>
      </div>

      {/* Sekcja dolna */}
      <div className="mt-4 md:absolute md:bottom-6 md:left-8 md:right-6 md:mb-4 md:ms-4  flex flex-col md:flex-row items-start gap-4">
        {/* Box z tekstem i przyciskami */}
        <div className="bg-indigo-950/60 text-white rounded-xl p-4 md:p-6 w-full md:w-[400px] shadow-lg h-52 flex flex-col justify-between">
          <p className="text-sm md:text-base leading-relaxed overflow-hidden">
            Obozy Akademii to projekt stworzony z myślą o młodych piłkarzach,
            którzy chcą aktywnie spędzać wolny czas, a przy okazji doskonalić
            swoje piłkarskie umiejętności.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="text-sm md:text-base px-5 py-2 rounded-md bg-orange-500 hover:bg-orange-600 transition text-white font-medium">
              Zapisz się
            </button>
            <button className="text-sm md:text-base px-5 py-2 rounded-md bg-white text-gray-900 hover:bg-gray-100 transition font-medium">
              Dowiedz się więcej
            </button>
          </div>
        </div>

        {/* Placeholder na wideo */}
        <div className="bg-white rounded-xl w-full md:w-96 shadow-lg overflow-hidden h-52">
          {!play ? (
            <button
              onClick={() => setPlay(true)}
              className="relative w-full h-full flex items-center justify-center group"
            >
              <Image
                src={thumbnail}
                alt="Video thumbnail"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <Play size={60} className="text-white z-10" />
            </button>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section> )};