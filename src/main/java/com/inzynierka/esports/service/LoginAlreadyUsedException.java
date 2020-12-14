package com.inzynierka.esports.service;

public class LoginAlreadyUsedException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public LoginAlreadyUsedException() {
        super("Login already used!");
    }

}
