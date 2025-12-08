package com.example.member.service;


import com.example.member.dto.*;
import com.example.member.jwt.TokenProvider;
import com.example.member.mybatis.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용으로 설정
public class AuthService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    // --- 1. 회원가입 (Sign Up) ---
    @Transactional
    public UserDTO signUp(UserDTO userDTO) {

        if (userMapper.findUserByEmail(userDTO.getEmail()) != null) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);

        userDTO.setSignupDate(LocalDateTime.now());
        userDTO.setDeleted('n');

        userMapper.saveUser(userDTO);

        return userDTO;
    }

    // --- 2. 로그인 (Sign In & Token Issuance) ---
    @Transactional
    public TokenDto signin(SignInDTO signInDTO) {

        UsernamePasswordAuthenticationToken authenticationToken = signInDTO.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        String accessToken = tokenProvider.createToken(authentication);

        return TokenDto.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .tokenExpiresIn(tokenProvider.getTokenValidityInMilliseconds() / 1000)
                .build();
    }

    // --- 3. 사용자 정보 수정 (Update User Info) ---
    @Transactional
    public int updateUser(UpdateUserInfoDTO updateDto) {

        int result = userMapper.updateUserInfo(updateDto);

        if (result == 0) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 수정에 실패했습니다. (UID: " + updateDto.getUid() + ")");
        }
        return result;
    }

    @Transactional
    public int updatePassword(UpdatePasswordDTO passwordDTO){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null){
            throw new RuntimeException("로그인된 사용자가 없습니다.");
        }
        String currentEmail = authentication.getName();

        UserDTO userInDB = userMapper.findUserByEmail(currentEmail);
        if (userInDB.getUid() != passwordDTO.getUid()){
            throw new RuntimeException("권한이 없습니다.");
        }
        if (!passwordEncoder.matches(passwordDTO.getCurrentPassword(), userInDB.getPassword())){
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }
        String encodedNewPassword = passwordEncoder.encode(passwordDTO.getNewPassword());

        int result = userMapper.updateUserPassword(passwordDTO.getUid(), encodedNewPassword);
        if (result == 0){
            throw new RuntimeException("비밀번호 수정에 실패했습니다.");
        }
        return result;
    }

    @Transactional
    public int softDeleteUser(DeleteUserDTO deleteUserDTO) {
        int result = userMapper.deleteUser(deleteUserDTO.getUid());

        if (result == 0) {
            throw new RuntimeException("사용자 정보를 찾을 수 없거나 삭제 처리에 실패했습니다.");
        }
        return result;
    }
}