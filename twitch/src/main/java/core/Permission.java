package core;

public enum Permission {
    Authority_manager(0),//权限管理者 b
    Announcement_manager(7),//公告管理者 l
    User_manager(8);//用户管理者 o

    private final int code;

    Permission(int code) {
        this.code = code;
    }

    public int code() {
        return code;
    }
}