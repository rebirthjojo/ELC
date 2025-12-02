package com.example.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED, reason = "Authentication failed")
public class SignInException extends RuntimeException{
    public SignInException(String message){
        super(message);
    }
}