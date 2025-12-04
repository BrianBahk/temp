package com.example.backend;

import com.example.backend.model.Publication;
import com.example.backend.repository.PublicationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(PublicationRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Publication("The Daily Chronicle","Jane Smith"));
                repository.save(new Publication("Tech Monthly","Alex Johnson"));
            }
        };
    }
}
