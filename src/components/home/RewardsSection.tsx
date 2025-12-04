import { Gift, TrendingUp, CreditCard, Star } from 'lucide-react';

const features = [
  {
    icon: Gift,
    title: 'Earn Points',
    description: 'Get 10% back on magazines and 20% back on newspapers with every subscription.',
  },
  {
    icon: TrendingUp,
    title: 'Points Never Expire',
    description: 'Your earned points are yours to keep. Use them whenever you want.',
  },
  {
    icon: CreditCard,
    title: 'Flexible Redemption',
    description: 'Use points to pay for subscriptions or combine with your credit card.',
  },
  {
    icon: Star,
    title: 'Exclusive Access',
    description: 'Get early access to new publications and member-only deals.',
  },
];

export function RewardsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container-narrow">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-reward/10 text-reward px-4 py-2 rounded-full mb-4">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-medium">Rewards Program</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Read More, Earn More
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our rewards program lets you earn points on every purchase. The more you subscribe, the more you save on future subscriptions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
