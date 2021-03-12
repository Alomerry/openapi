package core;

import lombok.NoArgsConstructor;

import java.util.Map;

@NoArgsConstructor
public class Err {
    private String desc;
    private Map<String, Object> extra;

    public String getDesc() {
        return desc;
    }

    public Err setDesc(String desc) {
        this.desc = desc;
        return this;
    }

    public Map<String, Object> getExtra() {
        return extra;
    }

    public Err setExtra(Map<String, Object> extra) {
        this.extra = extra;
        return this;
    }
}
