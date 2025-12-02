package com.example.member.controller;

import com.example.member.dto.SignInDTO;
import com.example.member.dto.UserDTO;
import com.example.member.exception.SignInException;
import com.example.member.mybatis.UserMapper;
import com.example.member.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class UserController {
    private final UserMapper userMapper;
    private final UserService userService;

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserDTO userDTO){

        try {
            userService.signup(userDTO);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> signIn(@Valid @RequestBody SignInDTO signInDTO) {
        try {
            userService.signIn(signInDTO);
            return ResponseEntity.ok().build();
        } catch (SignInException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}