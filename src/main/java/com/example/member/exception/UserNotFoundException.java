package com.example.member.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "대상이 없습니다.")
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message)
    {
        super(message);
    }
}
