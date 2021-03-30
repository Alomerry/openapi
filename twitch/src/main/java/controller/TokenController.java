package controller;

import component.redis.JedisUtil;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import model.token.vo.BaseTwitchAK;
import model.token.vo.GetAKRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import redis.clients.jedis.Jedis;

import javax.validation.Valid;

@RestController
public class TokenController {

    @Autowired
    private JedisUtil jedisUtil;

//    @PostMapping(value = "/getAK")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "test")
    })
    BaseTwitchAK getAK(@Valid @RequestBody GetAKRequest getAKRequest, BindingResult bindingResult) throws Exception {
//        if (result.hasErrors()) {
//            throw new InvalidParameterException(result.getFieldError().getDefaultMessage(), new String[]{result.getFieldError().getField()});
//        }
        String url = "https://id.twitch.tv/oauth2/token";
//        String url = "http://www.baidu.com";
        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        getAKRequest.setClient_id(System.getenv("twitch_client_id"));
        getAKRequest.setClient_secret(System.getenv("twitch_client_secret"));

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity(getAKRequest, httpHeaders);

        RestTemplate template = new RestTemplate();
        BaseTwitchAK result = template.postForObject(url, request, BaseTwitchAK.class);

        return result;
    }

    @PostMapping(value = "/getAK")
    @ApiResponses(value = {
            @ApiResponse(code = 200, message = "test")
    })
    String test(@Valid @RequestBody Object request, BindingResult bindingResult) throws Exception {
        jedisUtil.set("20182018","这是一条测试数据", 0);
        Long resExpire = jedisUtil.expire("20182018", 60, 0);//设置key过期时间
        String res = jedisUtil.get("20182018",0);
        return res;
    }


}
