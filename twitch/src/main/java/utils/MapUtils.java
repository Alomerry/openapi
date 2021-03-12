package utils;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

public class MapUtils {
    public static Map<String, Object> ConvertObjectToMap(Object obj) throws IllegalAccessException {
        Map<String, Object> mapper = new HashMap<>();
        Field[] fields = obj.getClass().getDeclaredFields();
        for (Field field : fields) {
            field.setAccessible(true);
            mapper.put(field.getName(), field.get(obj));
        }
        return mapper;
    }
}
