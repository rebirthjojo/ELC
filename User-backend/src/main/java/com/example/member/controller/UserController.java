package com.example.member.controller;

import com.example.member.dto.SignInDTO;
import com.example.member.dto.UpdateUserInfoDTO;
import com.example.member.dto.UserDTO;
import com.example.member.dto.TokenDto;
import com.example.member.exception.SignInException;
import com.example.member.exception.UserNotFoundException;
import com.example.member.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserDTO userDTO) {

        try {
            userService.signup(userDTO);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    @PostMapping("/signIn")
    public ResponseEntity<TokenDto> signIn(@Valid @RequestBody SignInDTO signInDTO) {
        try {
            TokenDto token = userService.signIn(signInDTO);
            return ResponseEntity.ok(token);
        } catch (SignInException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
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
}