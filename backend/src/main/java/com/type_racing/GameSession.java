package com.type_racing;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

public class GameSession {
    private Set<WebSocketSession> players;
    private boolean hasStarted;
    private String paragraph;

    public GameSession(String paragraph) {
        this.players = ConcurrentHashMap.newKeySet();
        this.hasStarted = false;
        this.paragraph = paragraph;
    }

    public void sendCurrentParagraphAndIfFinished(TextMessage current, WebSocketSession session, String code) throws IOException {
        boolean ended  = current.getPayload().equals(paragraph);
        for (WebSocketSession player : players) {
            if(!player.getId().equals(session.getId()))
                player.sendMessage(current);
            if(ended) {
                if (player.getId().equals(session.getId()))
                    player.sendMessage(new TextMessage("Game Won with code " + code));
                else
                    player.sendMessage(new TextMessage("Game Lost with code " + code));
                player.close();
            }
        }
    }

    public Set<WebSocketSession> getPlayers() {
        return players;
    }

    public void setPlayers(Set<WebSocketSession> players) {
        this.players = players;
    }

    public boolean isHasStarted() {
        return hasStarted;
    }

    public void setHasStarted(boolean hasStarted) {
        this.hasStarted = hasStarted;
    }

    public String getParagraph() {
        return paragraph;
    }

    public void setParagraph(String paragraph) {
        this.paragraph = paragraph;
    }

}
