package com.example.member.service;

import com.example.member.dto.DeleteUserDTO;
import com.example.member.dto.SignInDTO;
import com.example.member.dto.UpdateUserInfoDTO;
import com.example.member.dto.UserDTO;
import com.example.member.exception.SignInException;
import com.example.member.exception.UserNotFoundException;
import com.example.member.mybatis.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> updateUserinfo(UpdateUserInfoDTO updateUserInfoDTO) throws DataIntegrityViolationException {
        try {
            userMapper.updateUserInfo(updateUserInfoDTO);
            return ResponseEntity.noContent().build();
        }catch (DataIntegrityViolationException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

    }
    public void deleteUser(int uid) throws UserNotFoundException{
        int deletedRows = userMapper.deleteUser(uid);
        if (deletedRows == 0){
            throw new UserNotFoundException("사용자가 없습니다.");
        }
    }
}