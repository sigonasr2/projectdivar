package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.HashMap;

@RestController
public class Controller {

    @GetMapping("/image")
    public HashMap<String,String> helloWorld(@RequestParam("url") String url){
		HashMap<String,String> map = new HashMap<>();
		map.put("test1",Integer.toString(1));
		map.put("test2","Hello World");
        return map;
    }

}