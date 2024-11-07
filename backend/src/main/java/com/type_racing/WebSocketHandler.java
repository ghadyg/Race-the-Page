package com.type_racing;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayDeque;
import java.util.HashMap;
import java.util.Queue;
import java.util.Set;

public class WebSocketHandler extends TextWebSocketHandler {
    public static final HashMap<String,GameSession> games = new HashMap<>();

    //public String paragraph = "I said that I would see you because I had heard that you were a serious man. A man to be treated with respect but I must say no to you and I will give you my reasons. It's true, I have a lot of friends in politics.But they wouldn't be so friendly if they knew my business was drugs instead of gambling which they consider a harmless vice, but drugs, that's a dirty business.";
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws IOException {
        if(session.getUri() == null)
            session.close();
        String code = extractSessionCode(session.getUri().getQuery());
        if(code.isEmpty())
            session.close();
        System.out.println("connected");
        games.putIfAbsent(code,new GameSession(generateParagraph.getRandomPhrase()));
        Set<WebSocketSession> players = games.get(code).getPlayers();
        players.add(session);
        if(players.size()==2)
        {
            System.out.println("Game starting with code: "+ games.get(code).getParagraph());
            for(var player : players)
                player.sendMessage(new TextMessage("Game starting with phrase: "+ games.get(code).getParagraph()));
            games.get(code).setHasStarted(true);
        }
    }


    public String extractSessionCode(String query)
    {
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            String[] keyValue = pair.split("=");
            if (keyValue.length == 2 && keyValue[0].equals("code")) {
                return keyValue[1];
            }
        }
        return "";
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if(session.getUri() == null)
            session.close();
        String code = extractSessionCode(session.getUri().getQuery());
        if(code.isEmpty())
            session.close();

        games.get(code).sendCurrentParagraphAndIfFinished(message,session,code);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        if(session.getUri() == null)
            session.close();
        String code = extractSessionCode(session.getUri().getQuery());
        if(code.isEmpty())
            session.close();
        Set<WebSocketSession> players = games.get(code).getPlayers();
        players.remove(session);
        System.out.println(session.getClass());
        if(players.isEmpty())
            games.remove(code);
    }
}
