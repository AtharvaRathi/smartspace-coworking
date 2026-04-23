import { Map, Clock, ShieldCheck, Zap } from "lucide-react";

const features = [
  {
    name: "Interactive Floor Maps",
    description: "Visualize the entire workspace, find your favorite spot, and book it with a single click. Real-time availability ensures you never double-book.",
    icon: Map,
  },
  {
    name: "Instant Booking",
    description: "Secure a desk, private cabin, or a conference room instantly. Manage your schedule seamlessly from your dashboard.",
    icon: Zap,
  },
  {
    name: "Flexible Scheduling",
    description: "Book resources for an hour, a day, or a whole week. SmartSpace adapts to your hybrid work lifestyle.",
    icon: Clock,
  },
  {
    name: "Secure & Reliable",
    description: "Built with enterprise-grade security, ensuring that only verified members can access the premises and book resources.",
    icon: ShieldCheck,
  },
];

export default function Features() {
  return (
    <div className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for a modern office
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            SmartSpace is designed to make your coworking experience as smooth as possible, from arriving at the door to wrapping up your day.
          </p>
        </div>

        <div className="mt-20">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600 text-white shadow-lg">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
