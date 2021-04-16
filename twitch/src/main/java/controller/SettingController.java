package controller;

import exception.base.NotExistException;
import model.setting.po.DanmakuSetting;
import model.setting.po.Setting;
import model.setting.vo.DanmakuSettingVO;
import model.setting.vo.SettingVO;
import org.springframework.cglib.beans.BeanCopier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import service.SettingService;

import javax.annotation.Resource;

@RestController
public class SettingController {

    @Resource
    private SettingService settingService;

    // todo not auth check
    @GetMapping(value = "/settings/{userId}")
    // todo return response
    public SettingVO getUserById(@PathVariable String userId) throws Exception {
        // todo auto copy https://github.com/mapstruct/mapstruct
        if (userId == "") {
            throw new NotExistException("setting not found", null);
        }
        Setting setting = settingService.getSettingByUserId(userId);
        SettingVO vo = new SettingVO();
        DanmakuSetting dan = setting.getDanmakuSetting();
        DanmakuSettingVO danVO = new DanmakuSettingVO();
        BeanCopier beanCopier = BeanCopier.create(dan.getClass(), danVO.getClass(), false);
        beanCopier.copy(dan, danVO, null);
        beanCopier = BeanCopier.create(setting.getClass(), vo.getClass(), false);
        beanCopier.copy(setting, vo, null);
        vo.setDanmakuSetting(danVO);
        return vo;
    }
}
