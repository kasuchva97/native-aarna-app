# React Native core & navigation
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# Native UI & Assets
-keep class com.horcrux.svg.** { *; }
-dontwarn com.horcrux.svg.**
-keep class com.BV.LinearGradient.** { *; }
-dontwarn com.BV.LinearGradient.**
-keep class com.d11.fastimage.** { *; }
-dontwarn com.d11.fastimage.**
-keep class com.bumptech.glide.** { *; }
-dontwarn com.bumptech.glide.**

# Native Storage & Device Info
-keep class com.embracesolutions.encryptedstorage.** { *; }
-dontwarn com.embracesolutions.encryptedstorage.**
-keep class com.reactnativecommunity.asyncstorage.** { *; }
-dontwarn com.reactnativecommunity.asyncstorage.**
-keep class com.learnium.RNDeviceInfo.** { *; }
-dontwarn com.learnium.RNDeviceInfo.**
-keep class net.noidea.reactnativetts.** { *; }
-dontwarn net.noidea.reactnativetts.**

# PostHog & Analytics
-keep class com.posthog.** { *; }
-dontwarn com.posthog.**

# Config & Environment
-keep class com.lugg.RNCConfig.** { *; }
-dontwarn com.lugg.RNCConfig.**

# Keep app BuildConfig fields (accessed via reflection by react-native-config)
-keep class com.balakatha.app.BuildConfig { *; }

# Keep native methods
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
}
-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

# Firebase Crashlytics & Firebase Core
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception
-keep class com.google.firebase.crashlytics.** { *; }
-dontwarn com.google.firebase.crashlytics.**
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**

# OkHttp (used by Supabase)
-dontwarn okhttp3.**
-dontwarn okio.**
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Kotlin
-keep class kotlin.** { *; }
-keep class kotlin.Metadata { *; }
-dontwarn kotlin.**
-keepclassmembers class **$WhenMappings {
    <fields>;
}

# Keep source file names for crash stack traces
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Prevent stripping of JS bundle loader
-keep class com.facebook.react.ReactInstanceManager { *; }
