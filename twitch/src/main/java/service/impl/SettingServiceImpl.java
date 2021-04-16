package service.impl;

import dao.SettingDao;
import exception.base.NotExistException;
import model.setting.po.Setting;
import org.springframework.stereotype.Service;
import service.SettingService;

import javax.annotation.Resource;

@Service
public class SettingServiceImpl implements SettingService {

    @Resource
    private SettingDao settingDao;

    @Override
    public Setting getSettingByUserId(String userId) {
        Setting setting = settingDao.findSettingByUserId(userId);
        // todo remove insert
        if (setting == null) {
            throw new NotExistException("setting not found", null);
//            setting = new Setting(userId);
//            setting.setDanmakuSetting(new DanmakuSetting());
//            return settingDao.insert(setting);
        }
        return setting;
    }

    @Override
    public Setting createSettingByUserId(String userId) {
        return null;
    }
}
