const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const publications = [
  {
    id: "1",
    title: "The Economist",
    type: "magazine",
    description:
      "An international weekly newspaper printed in magazine-format and published digitally that focuses on current affairs, international business, politics, and technology.",
    price: 189.99,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop",
    issuesPerYear: 51,
    category: "Business & Finance",
    rating: 4.8,
    reviewCount: 1247,
    featured: true,
  },
  {
    id: "2",
    title: "National Geographic",
    type: "magazine",
    description:
      "The official magazine of the National Geographic Society, covering science, geography, history, and world culture.",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=500&fit=crop",
    issuesPerYear: 12,
    category: "Science & Nature",
    rating: 4.9,
    reviewCount: 2341,
    featured: true,
  },
  {
    id: "3",
    title: "The New Yorker",
    type: "magazine",
    description:
      "An American magazine featuring journalism, commentary, criticism, essays, fiction, satire, cartoons, and poetry.",
    price: 149.99,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=500&fit=crop",
    issuesPerYear: 47,
    category: "Culture & Literature",
    rating: 4.7,
    reviewCount: 1893,
    featured: true,
  },
  {
    id: "4",
    title: "Wired",
    type: "magazine",
    description:
      "A monthly magazine that focuses on how emerging technologies affect culture, the economy, and politics.",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop",
    issuesPerYear: 12,
    category: "Technology",
    rating: 4.5,
    reviewCount: 987,
    featured: false,
  },
  {
    id: "5",
    title: "Time Magazine",
    type: "magazine",
    description:
      "An American news magazine and news website published and based in New York City.",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=500&fit=crop",
    issuesPerYear: 26,
    category: "News & Politics",
    rating: 4.4,
    reviewCount: 1567,
    featured: false,
  },
  {
    id: "6",
    title: "The Wall Street Journal",
    type: "newspaper",
    description:
      "An American business-focused, English-language international daily newspaper based in New York City.",
    price: 38.99,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop",
    city: "New York",
    category: "Business & Finance",
    rating: 4.8,
    reviewCount: 3421,
    featured: true,
  },
  {
    id: "7",
    title: "The New York Times",
    type: "newspaper",
    description:
      "An American daily newspaper based in New York City with a worldwide readership.",
    price: 17.99,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=500&fit=crop",
    city: "New York",
    category: "News & Politics",
    rating: 4.7,
    reviewCount: 4532,
    featured: false,
  },
  {
    id: "8",
    title: "The Washington Post",
    type: "newspaper",
    description:
      "An American daily newspaper published in Washington, D.C. It is the most widely circulated newspaper within the Washington metropolitan area.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=500&fit=crop",
    city: "Washington D.C.",
    category: "News & Politics",
    rating: 4.6,
    reviewCount: 2876,
    featured: false,
  },
  {
    id: "9",
    title: "Forbes",
    type: "magazine",
    description:
      "An American business magazine featuring original articles on finance, industry, investing, and marketing topics.",
    price: 59.99,
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop",
    issuesPerYear: 8,
    category: "Business & Finance",
    rating: 4.5,
    reviewCount: 1234,
    featured: false,
  },
  {
    id: "10",
    title: "Chicago Tribune",
    type: "newspaper",
    description: "A daily newspaper based in Chicago, Illinois, United States.",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop",
    city: "Chicago",
    category: "News & Politics",
    rating: 4.3,
    reviewCount: 876,
    featured: false,
  },
  {
    id: "11",
    title: "Los Angeles Times",
    type: "newspaper",
    description:
      "A daily newspaper which has been published in Los Angeles, California, since 1881.",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=500&fit=crop",
    city: "Los Angeles",
    category: "News & Politics",
    rating: 4.4,
    reviewCount: 1234,
    featured: false,
  },
  {
    id: "12",
    title: "The Boston Globe",
    type: "newspaper",
    description:
      "An American daily newspaper founded and based in Boston, Massachusetts.",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop",
    city: "Boston",
    category: "News & Politics",
    rating: 4.5,
    reviewCount: 987,
    featured: false,
  },
  {
    id: "13",
    title: "San Francisco Chronicle",
    type: "newspaper",
    description:
      "A newspaper serving primarily the San Francisco Bay Area of the U.S. state of California.",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=500&fit=crop",
    city: "San Francisco",
    category: "News & Politics",
    rating: 4.2,
    reviewCount: 654,
    featured: false,
  },
];

async function main() {
  console.log("Start seeding...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@readsphere.com" },
    update: {},
    create: {
      email: "admin@readsphere.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
      points: 0,
      pointsEarned: 0,
    },
  });
  console.log(`Created admin user: ${admin.email}`);

  // Create test regular user (now admin for testing)
  const testUserPassword = await bcrypt.hash("test123", 10);
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      password: testUserPassword,
      role: "admin", // Changed to admin for testing delete functionality
      points: 100,
      pointsEarned: 100,
    },
  });
  console.log(`Created test user: ${testUser.email}`);

  for (const pub of publications) {
    const publication = await prisma.publication.upsert({
      where: { id: pub.id },
      update: {},
      create: pub,
    });
    console.log(`Created publication with id: ${publication.id}`);
  }

  // Create subscriptions for test user with expiration dates
  const now = new Date();
  const oneYearFromNow = new Date(now);
  oneYearFromNow.setFullYear(now.getFullYear() + 1);

  const sixMonthsFromNow = new Date(now);
  sixMonthsFromNow.setMonth(now.getMonth() + 6);

  const threeMonthsFromNow = new Date(now);
  threeMonthsFromNow.setMonth(now.getMonth() + 3);

  // Active subscriptions
  await prisma.subscription.create({
    data: {
      userId: testUser.id,
      publicationId: "1", // The Economist
      startDate: now,
      endDate: oneYearFromNow,
      status: "active",
      orderNumber: "ORD-SUB-001",
    },
  });

  await prisma.subscription.create({
    data: {
      userId: testUser.id,
      publicationId: "2", // National Geographic
      startDate: now,
      endDate: sixMonthsFromNow,
      status: "active",
      orderNumber: "ORD-SUB-002",
    },
  });

  await prisma.subscription.create({
    data: {
      userId: testUser.id,
      publicationId: "6", // Wall Street Journal
      startDate: now,
      endDate: threeMonthsFromNow,
      status: "active",
      orderNumber: "ORD-SUB-003",
    },
  });

  console.log("Created test user subscriptions");

  // Create sample approved reviews
  await prisma.review.create({
    data: {
      userId: testUser.id,
      publicationId: "3", // The New Yorker
      rating: 5,
      comment:
        "Absolutely love the in-depth journalism and thought-provoking articles. The cartoons are a delightful bonus!",
      status: "approved",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      publicationId: "1", // The Economist
      rating: 5,
      comment:
        "The best source for global business and political news. Excellent analysis and writing quality.",
      status: "approved",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      publicationId: "2", // National Geographic
      rating: 5,
      comment:
        "Stunning photography and fascinating articles about our planet. A must-read for nature lovers.",
      status: "approved",
    },
  });

  await prisma.review.create({
    data: {
      userId: admin.id,
      publicationId: "4", // Wired
      rating: 4,
      comment:
        "Great coverage of emerging technology trends. Sometimes a bit too technical, but always interesting.",
      status: "approved",
    },
  });

  await prisma.review.create({
    data: {
      userId: testUser.id,
      publicationId: "6", // Wall Street Journal
      rating: 5,
      comment:
        "Outstanding financial news and analysis. Essential reading for anyone interested in markets and economy.",
      status: "approved",
    },
  });

  // Create some pending reviews for testing delete functionality
  await prisma.review.create({
    data: {
      userId: admin.id,
      publicationId: "5", // Time Magazine
      rating: 4,
      comment:
        "Good coverage of current events, though sometimes feels a bit rushed.",
      status: "pending",
    },
  });

  await prisma.review.create({
    data: {
      userId: testUser.id,
      publicationId: "7", // The New York Times
      rating: 5,
      comment:
        "Excellent journalism and comprehensive coverage of national and international news.",
      status: "pending",
    },
  });

  console.log("Created sample reviews");
  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
