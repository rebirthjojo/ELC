package com.example.member.exception;

public class SignInException extends RuntimeException{
    public SignInException(String message){
        super(message);
    }
}