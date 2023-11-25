package com.trkpo.config;

import java.util.regex.Pattern;
import lombok.experimental.UtilityClass;

@UtilityClass
public class TagProperties {
    public final Pattern TAG_PATTERN = Pattern.compile("(?<=@)([a-zA-Z0-9]+)");
}
