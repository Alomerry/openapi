package model.setting.po;

import lombok.Data;

@Data
public class DanmakuSetting {
    private String messageFontStyle; // 弹幕字体
    private boolean showHeadImg; // 是否展示弹幕头像
    private BadgesIcon[] needShowIcons; // 需要展示的徽章图标
    private boolean showMessageTime; // 是否展示弹幕发送时间
    private boolean showViewerNumber; // 是否展示观看人数
    private String messageAnimation; // 弹幕动画效果
    private boolean ttsEnabled; // 是否开启语音播放
    private String ttsType; // 语音语种
}

enum BadgesIcon {
    MOD,
    VIP,
    SUB,
}
