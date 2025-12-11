package com.example.member.controller;

import com.example.member.dto.SignInDTO;
import com.example.member.dto.UpdateUserInfoDTO;
import com.example.member.dto.UserDTO;
import com.example.member.dto.TokenDTO;
import com.example.member.exception.UserNotFoundException;
import com.example.member.service.AuthService;
import com.example.member.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
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
    public ResponseEntity<Void> signIn(@Valid @RequestBody SignInDTO signInDTO, HttpServletResponse response) {
        authService.signIn(signInDTO, response);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reissue")
    public ResponseEntity<Void> reissue(@RequestBody TokenDTO tokenDTO, HttpServletResponse response){
        authService.reissue(tokenDTO, response);
        return ResponseEntity.ok().build();
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

    @DeleteMapping("/users/{uid}")
    public ResponseEntity<?> deleteUser(@PathVariable int uid) {
        try {
            userService.deleteUser(uid);
            return ResponseEntity.noContent().build();
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status((HttpStatus.BAD_REQUEST)).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/signOut")
    public ResponseEntity<Void> signOut(HttpServletResponse response){
        authService.signOut(response);
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