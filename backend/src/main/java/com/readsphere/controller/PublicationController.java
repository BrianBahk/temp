package com.readsphere.controller;

import com.readsphere.model.Publication;
import com.readsphere.service.PublicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/publications")
public class PublicationController {

    @Autowired
    private PublicationService publicationService;

    @GetMapping
    public ResponseEntity<List<Publication>> getAllPublications() {
        return ResponseEntity.ok(publicationService.getAllPublications());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Publication> getPublicationById(@PathVariable Long id) {
        return ResponseEntity.ok(publicationService.getPublicationById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Publication>> getPublicationsByType(@PathVariable String type) {
        return ResponseEntity.ok(publicationService.getPublicationsByType(type));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Publication>> getFeaturedPublications() {
        return ResponseEntity.ok(publicationService.getFeaturedPublications());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Publication>> searchPublications(@RequestParam String query) {
        return ResponseEntity.ok(publicationService.searchPublications(query));
    }
}
