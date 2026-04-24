import { ArrowRight, Tag, Zap } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden"
      style={{ minHeight: 480 }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1704940681667-54510c1fc4e3?w=1400&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-blue-600/50 border border-blue-500/50 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            Лучшие цены на технику 2025
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            Бытовая техника
            <br />
            <span className="text-yellow-400">мирового класса</span>
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-lg">
            Более 5000 товаров от ведущих производителей. Доставка по всей
            России, гарантия до 5 лет.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3.5 rounded-xl flex items-center gap-2 transition-colors"
            >
              Перейти в каталог
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/catalog?sale=true"
              className="border border-white/40 hover:bg-white/10 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 transition-colors backdrop-blur-sm"
            >
              <Tag className="w-5 h-5 text-yellow-400" />
              Акции и скидки
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12">
            {[
              { value: "5000+", label: "Товаров" },
              { value: "50 000+", label: "Покупателей" },
              { value: "4.8★", label: "Рейтинг" },
              { value: "10 лет", label: "На рынке" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-yellow-400">
                  {s.value}
                </div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block w-50">
          <div className="bg-transparent rounded-lg p-1.5">
            <Zap className="w-40 h-40 text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
