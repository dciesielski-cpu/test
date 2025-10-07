
import { BadgeCheck, Sparkles, Rocket } from "lucide-react";

// Styl i animacje dopasowane do Twojej galerii: ciemne tło, pomarańczowe akcenty,
// miękkie cienie, zaokrąglenia 2xl oraz subtelne wejście elementów.
// Sekcja przedstawia 3 kroki/cechy w formie kafelków z okrągłymi "badge'ami" na górze
// i dekoracyjnymi bocznymi tabami po lewej i prawej stronie.

const items = [
  {
    title: "Joanna",
    desc: "Syn chce być drugim Ronaldo! Trenerzy na obozie byli bardzo profesjonalni i dużo nauczyli chłopców. Hotel, w którym stacjonował turnus stanął na wysokości zadania przy organizacji.",
    Icon: BadgeCheck,
  },
  {
    title: "Agata",
    desc: "Dużo przestrzeni wokół ośrodka, w którym mieszkały dzieci, fajne boiska i wspaniała atmosfera. Panowie trenerzy dobrze wykonują swoją pracę. Jesteśmy z synem bardzo zadowoleni z wyjazdu.",
    Icon: Sparkles,
  },
  {
    title: "Beata",
    desc: "Bardzo profesjonalnie przeprowadzony i zorganizowany obóz. Konsultanci z infolinii bardzo rzetelni i pomocni przy dokonywaniu formalności. Syn był tak zadowolony, że nie chciał wracać.",
    Icon: Rocket,
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-slate-700/90 mt-12 py-14 md:py-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white tracking-tight">Opinie Rodziców</h2>

        {/* Wrapper z dekorem bocznych tabów */}
        <div className="relative mt-18">
          {/* Lewy tab dekoracyjny */}
          <span className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-slate-300/80 rounded-sm shadow-md" />
          {/* Prawy tab dekoracyjny */}
          <span className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-6 bg-slate-300/80 rounded-sm shadow-md" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-6">
            {items.map(({ title, desc, Icon }) => (
              <div
                key={title}
                className="relative bg-slate-200 shadow-xl px-12 pt-20 pb-6 md:pb-8 min-h-[180px] md:min-h-[330px] overflow-visible"
              >
                {/* Górny okrągły badge */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 h-24 w-24 rounded-full bg-slate-300 shadow-md grid place-items-center">
                  <Icon className="h-6 w-6 text-slate-700" />
                </div>

                <h3 className="text-lg md:text-xl font-semibold text-slate-800 tracking-tight text-center md:text-left">
                  {title}
                </h3>
                <p className="mt-2 text-sm md:text-base text-slate-600 text-center md:text-left">
                  {desc}
                </p>

                {/* Dolna linia akcentowa */}
                <span className="pointer-events-none absolute inset-x-6 bottom-0 h-1 rounded-t-full bg-orange-500/80" />

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}