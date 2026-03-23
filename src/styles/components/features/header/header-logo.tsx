import { Zap } from "lucide-react";
import Link from "next/link";

export default function HeaderLogo() {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <div className="bg-blue-600 rounded-lg p-1.5">
        <Zap className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="font-bold text-gray-900 leading-none text-lg">
          TechStore
        </div>
        <div className="text-xs text-blue-600 leading-none">
          Бытовая техника
        </div>
      </div>
    </Link>
  );
}
