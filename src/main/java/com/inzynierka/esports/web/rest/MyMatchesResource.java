package com.inzynierka.esports.web.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * MyMatchesResource controller
 */
@RestController
@RequestMapping("/api/my-matches")
public class MyMatchesResource {

    private final Logger log = LoggerFactory.getLogger(MyMatchesResource.class);

    /**
    * GET loadMyMatches
    */
    @GetMapping("/load-my-matches")
    public String loadMyMatches() {
        return "loadMyMatches";
    }

}
