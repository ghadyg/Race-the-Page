package com.type_racing;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayDeque;
import java.util.Queue;
import java.util.UUID;

@RestController
@RequestMapping(path = "/game")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    public static final Queue<String> waitingForPPL = new ArrayDeque<>();
    @GetMapping
    public String getCode()
    {
        if(!waitingForPPL.isEmpty())
            return waitingForPPL.poll();

        String code = UUID.randomUUID().toString();
        while(WebSocketHandler.games.containsKey(code))
        {
            code = UUID.randomUUID().toString();
        }
        waitingForPPL.add(code);
        return code;
    }

    @PostMapping("/{id}")
    public ResponseEntity<String> createPrivateGame(@PathVariable("id") String code)
    {
        if(WebSocketHandler.games.containsKey(code))
            return ResponseEntity.status(HttpStatus.CONFLICT).body("game with code "+code+" already exist");
        return ResponseEntity.status(HttpStatus.CREATED).body("Game created with code " + code);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Boolean> checkIfGameExist(@PathVariable("id") String code) {
        boolean exists = WebSocketHandler.games.containsKey(code);
        return ResponseEntity.ok(exists);
    }


}
