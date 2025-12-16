package com.example.member.controller;

import com.example.member.dto.SearchDTO;
import com.example.member.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    @GetMapping("/suggestions")
    public List<SearchDTO> getSearchSuggestions(
            @RequestParam(value = "q") String query) {
        return searchService.gerSuggestions(query);
    }
}
