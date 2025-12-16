package com.example.member.mybatis;

import com.example.member.dto.SearchDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SearchMapper {
    List<SearchDTO> findSearchByKeyword(@Param("query") String query);
}