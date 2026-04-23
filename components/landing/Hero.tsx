import Link from "next/link";
import { ArrowRight, Building, CalendarCheck, Shield } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 bg-white pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Modern workspace</span>{' '}
                <span className="block text-blue-600 xl:inline">for modern teams</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                SmartSpace provides an intuitive platform to book desks, cabins, and meeting rooms instantly. Elevate your productivity in a seamlessly managed environment.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-blue-50 flex items-center justify-center">
        {/* Abstract representation of a workspace map */}
        <div className="grid grid-cols-3 gap-4 p-8 w-full max-w-lg opacity-80">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`h-24 rounded-xl shadow-sm border-2 ${i % 3 === 0 ? 'bg-white border-blue-200' : i % 2 === 0 ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-100'} flex items-center justify-center`}>
              {i % 3 === 0 && <Building className="text-blue-400 w-8 h-8" />}
              {i % 2 === 0 && i % 3 !== 0 && <CalendarCheck className="text-blue-500 w-8 h-8" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
