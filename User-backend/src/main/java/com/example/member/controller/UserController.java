package com.example.member.controller;

import com.example.member.dto.*;
import com.example.member.exception.UserNotFoundException;
import com.example.member.service.AuthService;
import com.example.member.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class UserController {

    private final UserService userService;
    private final AuthService authService;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserDTO userDTO) {

        try {
            userService.signup(userDTO);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            log.error("데이터 처리 중 충돌 발생", e);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/signIn")
    public ResponseEntity<TokenDTO> signIn(@Valid @RequestBody SignInDTO signInDTO) {
        TokenDTO tokenDTO = authService.signIn(signInDTO);
        return ResponseEntity.ok(tokenDTO);
    }

    @PostMapping("/reissue")
    public ResponseEntity<TokenDTO> reissue(@RequestBody TokenDTO tokenDTO){
        TokenDTO newTokenDTO = authService.reissue(tokenDTO);
        return ResponseEntity.ok(newTokenDTO);
    }

    @PutMapping("/users/{uid}")
    public ResponseEntity<?> updateUserInfo(@PathVariable int uid,
                                            @Valid @RequestBody UpdateUserInfoDTO updateUserInfoDTO) {
        try {
            updateUserInfoDTO.setUid(uid);
            userService.updateUserinfo(updateUserInfoDTO);

            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/users/myinfo")
    public ResponseEntity<?> updateUserDetail(@Valid @RequestBody UpdateUserDetailDTO detailDTO){
        userService.updateUserDetail(detailDTO);
        return ResponseEntity.ok("정보 수정 성공");
    }

    @PutMapping("/users/password")
    public ResponseEntity<Void> updatePassword(@Valid @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        try {
            userService.updatePassword(updatePasswordDTO);
            return ResponseEntity.noContent().build();
        }catch (UserNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable int uid) {
        try {
            userService.deleteUser(uid);
            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status((HttpStatus.BAD_REQUEST)).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/signOut")
    public ResponseEntity<Void> signOut(){
        authService.signOut();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users/me")
    public ResponseEntity<UserDTO> getCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = authentication.getName();

        UserDTO userDetails = userService.findUserByEmail(currentEmail);
        return ResponseEntity.ok(userDetails);
    }
}