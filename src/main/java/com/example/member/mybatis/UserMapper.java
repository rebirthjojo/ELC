package com.example.member.mybatis;

import com.example.member.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    void saveUser(UserDTO userDTO);
    UserDTO findUserByEmail(String email);
    int updateUserInfo(UserDTO userDTO);
    int deleteUser(int uid);
}
