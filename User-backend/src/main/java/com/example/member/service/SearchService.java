package com.example.member.service;

import com.example.member.dto.SearchDTO;
import com.example.member.mybatis.SearchMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {
    private final SearchMapper searchMapper;

    public List<SearchDTO> gerSuggestions(String query){
        if (query == null || query.trim().isEmpty()){
            return List.of();
        }
        return searchMapper.findSearchByKeyword(query.trim());
    }
}
