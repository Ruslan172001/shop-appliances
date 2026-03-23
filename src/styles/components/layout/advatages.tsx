import { CreditCard, Headphones, Shield, Truck } from "lucide-react";

const advantages = [
  {
    icon: Truck,
    title: "Бесплатная доставка",
    desc: "от 5 000 ₽ по России",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Shield,
    title: "Гарантия качества",
    desc: "официальная гарантия производителя",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: CreditCard,
    title: "Рассрочка 0%",
    desc: "на 12 месяцев без переплат",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    desc: "консультация специалистов",
    color: "bg-amber-50 text-amber-600",
  },
];
export default function Advatages() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {advantages.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
              >
                <Icon size={20} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-800">{title}</div>
                <div className="text-xs text-gray-500">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
