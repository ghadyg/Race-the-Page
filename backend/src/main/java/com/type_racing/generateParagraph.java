package com.type_racing;

import java.util.Random;

public class generateParagraph {

    private static final String[] phrases = {
            "I said that I would see you because I had heard that you were a serious man. A man to be treated with respect but I must say no to you and I will give you my reasons. It's true, I have a lot of friends in politics.But they wouldn't be so friendly if they knew my business was drugs instead of gambling which they consider a harmless vice, but drugs, that's a dirty business.",
            "I told her that I would meet her at the restaurant because I knew she was a person of importance, someone who understood the value of loyalty. But I have to be honest with you, I'm not sure how I feel about her anymore. She has connections, but that doesn't change the fact that she's too involved in things I can't afford to be a part of. It's not just the money, it's the danger that comes with it.",
            "I called him because I knew he had the kind of skills that could help me, but I wasn't prepared for the kind of risk that came with his services. He promised results, but now I'm starting to wonder whether it's worth it. People like him operate in the shadows, and I'm not sure I want to live there with him, even if the rewards are tempting.",
            "She asked me if I thought it was possible to trust someone so easily, and at first, I wasn't sure what to say. Trust is a tricky thing, and I've learned the hard way that it can be broken in an instant. Still, I agreed to give it a try, though deep down I knew there was more to her story than she was letting on. The truth is often hidden beneath layers, and it's not always something you want to uncover.",
            "I warned him that getting involved in this business could bring more trouble than it's worth, but he seemed determined to prove me wrong. I respect his ambition, but I also know how dangerous it can be to push boundaries. Sometimes the price of success isn't something you can pay back with just money, it's your reputation, your freedom, and maybe even your life.",
            "I thought about telling her that I had other plans, but I couldn't bring myself to disappoint her. She had always been there for me when I needed someone to rely on, but lately, I've been questioning whether I can continue down this path. There are too many things happening in the background, and I'm not sure I can trust everyone involved, even if they've been loyal in the past."
    };

    private static Random random = new Random();

    public static String getRandomPhrase() {
        int index = random.nextInt(phrases.length);
        return phrases[index];
    }

}
