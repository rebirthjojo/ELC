package com.example.member.service;

import com.example.member.dto.*;
import com.example.member.exception.SignInException;
import com.example.member.exception.UserNotFoundException;
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
@Transactional(readOnly = true)
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final TokenProvider tokenProvider;

    public UserDTO findUserByEmail(String email) {

        return userMapper.findUserByEmail(email);
    }

    @Transactional
    public void signup(UserDTO userDTO) {
        if (userMapper.findUserByEmail(userDTO.getEmail()) != null) {
            throw new RuntimeException("이미 가입된 유저입니다.");
        }
        userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        userDTO.setSignupDate(LocalDateTime.now());
        userDTO.setDeleted('n');
        userDTO.setTutor('n');
        userMapper.saveUser(userDTO);
    }

    @Transactional
    public TokenDTO signIn(SignInDTO signInDTO) throws SignInException {
        try {
            UsernamePasswordAuthenticationToken authenticationToken = signInDTO.toAuthentication();
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

            String currentEmail = authentication.getName();
            UserDTO userDetails = userMapper.findUserByEmail(currentEmail);
            Character tutorStatus = userDetails.getTutor();

            String accessToken = tokenProvider.createToken(authentication, tutorStatus);
            return TokenDTO.builder()
                    .grantType("Bearer")
                    .accessToken(accessToken)
                    .tokenExpiresIn(tokenProvider.getTokenValidityInMilliseconds() / 1000)
                    .build();
        } catch (Exception e) {
            throw new SignInException("인증 정보가 올바르지 않습니다.");
        }
    }

    @Transactional
    public void updateUserinfo(UpdateUserInfoDTO updateDto) throws UserNotFoundException {
        int result = userMapper.updateUserInfo(updateDto);
        if (result == 0) {
            throw new UserNotFoundException("수정하려는 사용자를 찾을 수 없습니다.");
        }
    }

    @Transactional
    public void deleteUser(int uid) throws UserNotFoundException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())){
            throw new RuntimeException("로그인 해주세요.");
        }
        UserDTO userInDB = userMapper.findUserByEmail(authentication.getName());
        if (userInDB == null || userInDB.getUid().intValue() != uid){
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }
        int result = userMapper.deleteUser(uid);
        if (result == 0) {
            throw new UserNotFoundException("삭제하려는 사용자를 찾을 수 없습니다.");
        }
    }
}