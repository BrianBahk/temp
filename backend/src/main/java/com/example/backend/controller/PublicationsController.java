package com.example.backend.controller;

import com.example.backend.model.Publication;
import com.example.backend.repository.PublicationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class PublicationsController {

    private final PublicationRepository repository;

    public PublicationsController(PublicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/health")
    public String health() {
        return "ok";
    }

    @GetMapping("/publications")
    public List<Publication> list() {
        return repository.findAll();
    }
}
