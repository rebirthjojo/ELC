package com.example.member.service;

import com.example.member.dto.SignInDTO;
import com.example.member.dto.UserDTO;
import com.example.member.exception.SignInException;
import com.example.member.mybatis.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;

    public void signup(UserDTO userDTO) throws Exception{
        UserDTO foundUser = userMapper.findUserByEmail(userDTO.getEmail());
        if (foundUser != null){
            throw new Exception("이미 가입된 이메일 입니다.");
        }
        userMapper.saveUser(userDTO);
    }
    public void signIn(SignInDTO signInDTO) throws SignInException {
        UserDTO foundUser = userMapper.findUserByEmail((signInDTO.getEmail()));
        if (foundUser == null || !signInDTO.getPassword().equals(foundUser.getPassword())){
            throw new SignInException("Not Found");
        }
    }
}