package service;

import model.setting.po.Setting;
import org.springframework.stereotype.Service;

@Service
public interface SettingService {
    Setting getSettingByUserId(String userId);

    Setting createSettingByUserId(String userId);
}
