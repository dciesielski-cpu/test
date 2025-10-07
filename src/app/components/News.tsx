import Image from "next/image";

export default function News() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Nagłówek */}
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Aktualności
      </h2>

      {/* Grid z kartami */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Karta 1 */}
        <div className="flex flex-col overflow-hidden">
          <Image
            src="/news-1.jpg" // <- podmień na swoje zdjęcie
            alt="Podsumowanie wakacji 2025"
            width={400}
            height={250}
            className="w-full h-80 object-cover bg-gray-500"
          />
          <div className="bg-gray-700 text-white text-lg text-center mt-4 px-8 py-4 font-medium">
            Podsumowanie WAKACJI 2025 z Akademią
          </div>
        </div>
        {/* Karta 1 */}
        <div className="flex flex-col overflow-hidden">
          <Image
            src="/news-1.jpg" // <- podmień na swoje zdjęcie
            alt="Podsumowanie wakacji 2025"
            width={400}
            height={250}
            className="w-full h-80 object-cover bg-gray-500"
          />
          <div className="bg-gray-700 text-white text-lg text-center mt-4 px-8 py-4 font-medium">
            Podsumowanie WAKACJI 2025 z Akademią
          </div>
        </div>
        {/* Karta 1 */}
        <div className="flex flex-col overflow-hidden">
          <Image
            src="/news-1.jpg" // <- podmień na swoje zdjęcie
            alt="Podsumowanie wakacji 2025"
            width={400}
            height={250}
            className="w-full h-80 object-cover bg-gray-500"
          />
          <div className="bg-gray-700 text-white text-lg text-center mt-4 px-8 py-4 font-medium">
            Podsumowanie WAKACJI 2025 z Akademią
          </div>
        </div>

        
      </div>
    </section>)};