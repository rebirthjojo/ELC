package com.example.member.mybatis;

import com.example.member.dto.UpdatePasswordDTO;
import com.example.member.dto.UpdateUserInfoDTO;
import com.example.member.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    void saveUser(UserDTO userDTO);
    UserDTO findUserByEmail(String email);
    int updateUserInfo(UpdateUserInfoDTO updateUserInfoDTO);
    int updateUserPassword(@Param("uid") int uid, @Param("newPassword") String newPassword);
    int deleteUser(int uid);
}
