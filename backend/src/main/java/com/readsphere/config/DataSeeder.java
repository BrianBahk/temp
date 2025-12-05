package com.readsphere.config;

import com.readsphere.model.*;
import com.readsphere.repository.PublicationRepository;
import com.readsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PublicationRepository publicationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed users if not exists
        if (userRepository.count() == 0) {
            seedUsers();
        }

        // Seed publications if not exists
        if (publicationRepository.count() == 0) {
            seedPublications();
        }
    }

    private void seedUsers() {
        // Create demo user
        User demoUser = new User();
        demoUser.setUsername("demo");
        demoUser.setPassword(passwordEncoder.encode("demo"));
        demoUser.setEmail("demo@readsphere.com");
        demoUser.setFirstName("Demo");
        demoUser.setLastName("User");
        demoUser.setMiddleInitial("D");
        demoUser.setAddress("123 Demo St, Demo City, DC 12345");
        demoUser.setCardNumber("4111111111111111");
        demoUser.setExpiryDate("12/25");
        demoUser.setCvv("123");
        demoUser.setNameOnCard("Demo User");
        demoUser.setPoints(1000);
        demoUser.setRole(UserRole.USER);
        userRepository.save(demoUser);

        // Create admin user
        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin"));
        adminUser.setEmail("admin@readsphere.com");
        adminUser.setFirstName("Admin");
        adminUser.setLastName("User");
        adminUser.setMiddleInitial("A");
        adminUser.setAddress("456 Admin Ave, Admin City, AC 67890");
        adminUser.setCardNumber("5500000000000004");
        adminUser.setExpiryDate("06/26");
        adminUser.setCvv("456");
        adminUser.setNameOnCard("Admin User");
        adminUser.setPoints(500);
        adminUser.setRole(UserRole.ADMIN);
        userRepository.save(adminUser);
    }

    private void seedPublications() {
        createMagazine(1L, "The Economist", "An international weekly newspaper printed in magazine-format and published digitally that focuses on current affairs, international business, politics, and technology.",
                189.99, "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop", 51, "Business & Finance", 4.8, 1247, true);

        createMagazine(2L, "National Geographic", "The official magazine of the National Geographic Society, covering science, geography, history, and world culture.",
                39.99, "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400&h=500&fit=crop", 12, "Science & Nature", 4.9, 2341, true);

        createMagazine(3L, "The New Yorker", "An American magazine featuring journalism, commentary, criticism, essays, fiction, satire, cartoons, and poetry.",
                149.99, "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=500&fit=crop", 47, "Culture & Literature", 4.7, 1893, true);

        createMagazine(4L, "Wired", "A monthly magazine that focuses on how emerging technologies affect culture, the economy, and politics.",
                29.99, "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop", 12, "Technology", 4.5, 987, false);

        createMagazine(5L, "Time Magazine", "An American news magazine and news website published and based in New York City.",
                49.99, "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=500&fit=crop", 26, "News & Politics", 4.4, 1567, false);

        createMagazine(9L, "Forbes", "An American business magazine featuring original articles on finance, industry, investing, and marketing topics.",
                59.99, "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=500&fit=crop", 8, "Business & Finance", 4.5, 1234, false);

        createNewspaper(6L, "The Wall Street Journal", "An American business-focused, English-language international daily newspaper based in New York City.",
                38.99, "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop", "New York", "Business & Finance", 4.8, 3421, true);

        createNewspaper(7L, "The New York Times", "An American daily newspaper based in New York City with a worldwide readership.",
                17.99, "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400&h=500&fit=crop", "New York", "News & Politics", 4.7, 4532, false);

        createNewspaper(8L, "The Washington Post", "An American daily newspaper published in Washington, D.C. It is the most widely circulated newspaper within the Washington metropolitan area.",
                15.99, "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=500&fit=crop", "Washington D.C.", "News & Politics", 4.6, 2876, false);

        createNewspaper(10L, "Chicago Tribune", "A daily newspaper based in Chicago, Illinois, United States.",
                12.99, "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=500&fit=crop", "Chicago", "News & Politics", 4.3, 876, false);
    }

    private void createMagazine(Long id, String title, String description, double price, String image,
                                 int issuesPerYear, String category, double rating, int reviewCount, boolean featured) {
        Publication pub = new Publication();
        pub.setTitle(title);
        pub.setType(PublicationType.MAGAZINE);
        pub.setDescription(description);
        pub.setPrice(price);
        pub.setImage(image);
        pub.setIssuesPerYear(issuesPerYear);
        pub.setCategory(category);
        pub.setRating(rating);
        pub.setReviewCount(reviewCount);
        pub.setFeatured(featured);
        publicationRepository.save(pub);
    }

    private void createNewspaper(Long id, String title, String description, double price, String image,
                                  String city, String category, double rating, int reviewCount, boolean featured) {
        Publication pub = new Publication();
        pub.setTitle(title);
        pub.setType(PublicationType.NEWSPAPER);
        pub.setDescription(description);
        pub.setPrice(price);
        pub.setImage(image);
        pub.setCity(city);
        pub.setCategory(category);
        pub.setRating(rating);
        pub.setReviewCount(reviewCount);
        pub.setFeatured(featured);
        // Newspapers are daily
        pub.setIssuesPerYear(365);
        publicationRepository.save(pub);
    }
}
