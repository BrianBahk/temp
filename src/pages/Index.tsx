import { Layout } from '@/components/layout/Layout';
import { Hero } from '@/components/home/Hero';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { RewardsSection } from '@/components/home/RewardsSection';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedSection />
      <RewardsSection />
    </Layout>
  );
};

export default Index;
