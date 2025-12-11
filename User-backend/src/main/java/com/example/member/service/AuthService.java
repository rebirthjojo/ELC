package com.example.member.service;


import com.example.member.dto.*;
import com.example.member.jwt.TokenProvider;
import com.example.member.mybatis.UserMapper;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;
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
public class AuthService {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final TokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Transactional
    public UserDTO signUp(UserDTO userDTO) {

        if (userMapper.findUserByEmail(userDTO.getEmail()) != null) {
            throw new RuntimeException("이미 가입되어 있는 유저입니다.");
        }

        String encodedPassword = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(encodedPassword);

        userDTO.setSignupDate(LocalDateTime.now());
        userDTO.setDeleted('n');
        if (userDTO.getTutor() == null) {
            userDTO.setTutor('n');
        }

        userMapper.saveUser(userDTO);

        return userDTO;
    }

    @Transactional
    public void signIn(SignInDTO signInDTO, HttpServletResponse response) {

        UsernamePasswordAuthenticationToken authenticationToken = signInDTO.toAuthentication();

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        String currentEmail = authentication.getName();
        UserDTO userDetails = userMapper.findUserByEmail(currentEmail);
        Character tutorStatus = userDetails.getTutor();

        String accessToken = tokenProvider.createToken(authentication, tutorStatus);
        String refreshToken = tokenProvider.createRefreshToken(authentication);

        tokenProvider.addAccessTokenCookie(response, accessToken);
        tokenProvider.addRefreshTokenCookie(response, refreshToken, signInDTO.isKeepLoggedIn());

        return;
    }

    @Transactional
    public void reissue(TokenDTO tokenDTO, HttpServletResponse response){
        if (!tokenProvider.validateToken(tokenDTO.getRefreshToken())){
            throw new RuntimeException("Refresh Token이 유효하지 않습니다.");
        }

        Authentication authentication = tokenProvider.getAuthenticationFromRefreshToken(tokenDTO.getRefreshToken());
        String userId = authentication.getName();

        UserDTO userDetails = userMapper.findUserByEmail(authentication.getName());
        Character tutorStatus = userDetails.getTutor();
        String newAccessToken = tokenProvider.createToken(authentication, tutorStatus);

        tokenProvider.addAccessTokenCookie(response, newAccessToken);
    }

    @Transactional
    public void signOut(HttpServletResponse response){

        tokenProvider.deleteTokenCookies(response);
    }

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