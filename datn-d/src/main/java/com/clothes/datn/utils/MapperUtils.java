package com.clothes.datn.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.*;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class MapperUtils {
    private static ModelMapper mm = new ModelMapper();
    private static Gson gson;
    static {
        mm.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
    }

    public static <T, E> T map(E entity, Class<T> clazz) {
        return mm.map(entity, clazz);
    }

    public static <T, E> void mapFromSource(E source, T updatedOn) {
        mm.map(source, updatedOn);
    }

    public static <T, E> List<T> mapList(List<E> entity, Class<T> clazz) {
        return entity.stream().map(e -> mm.map(e, clazz)).collect(Collectors.toList());
    }
    public static <D, T> Page<D> mapEntityPageIntoDtoPage(Page<T> entities, Class<D> dtoClass) {
        return entities.map(objectEntity -> mm.map(objectEntity, dtoClass));
    }

    public static <T> String toJson(T obj) {
        return getGson().toJson(obj);
    }

    public static <T> JsonElement toJsonTree(T obj) {
        return getGson().toJsonTree(obj);
    }

    public static Gson getGson() {
        if (null == gson) {
            gson = new Gson();
        }
        return gson;
    }

    public static JsonObject toJsonObject(String json) {
        return getGson().fromJson(json, JsonObject.class);
    }

    public static JsonArray toJsonArray(String json) {
        return JsonParser.parseString(json).getAsJsonArray();
    }

    public static <T> T parseJson(String json, Class<T> clazz) {
        return getGson().fromJson(json, clazz);
    }

    public static JsonObject mergeJsonObject(JsonObject obj1, JsonObject obj2) {
        obj2.entrySet().forEach(entry -> {
            obj1.add(entry.getKey(), entry.getValue());
        });
        return obj1;
    }

    public static String getFieldFromJson(String json, String... keys) {
        JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
        for (int i = 0; i < keys.length - 1; i++) {
            jsonObject = jsonObject.get(keys[i]).getAsJsonObject();
        }
        return jsonObject.get(keys[keys.length - 1]).getAsString();
    }

    @SuppressWarnings("rawtypes")
    public static Map objectToMap(Object obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(obj, Map.class);
    }
}

