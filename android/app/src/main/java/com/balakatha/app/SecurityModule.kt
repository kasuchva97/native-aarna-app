package com.balakatha.app

import android.os.Build
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File

class SecurityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "SecurityModule"

    @ReactMethod
    fun isRooted(promise: Promise) {
        try {
            promise.resolve(
                checkSuBinaries() ||
                checkDangerousApps() ||
                checkBuildTags() ||
                checkSystemWritable() ||
                checkRootCloakingApps()
            )
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    @ReactMethod
    fun isEmulatorRunning(promise: Promise) {
        try {
            val isEmulator = (Build.FINGERPRINT.startsWith("generic")
                || Build.FINGERPRINT.startsWith("unknown")
                || Build.MODEL.contains("google_sdk")
                || Build.MODEL.contains("Emulator")
                || Build.MODEL.contains("Android SDK built for x86")
                || Build.MANUFACTURER.contains("Genymotion")
                || Build.BRAND.startsWith("generic") && Build.DEVICE.startsWith("generic")
                || "google_sdk" == Build.PRODUCT)
            promise.resolve(isEmulator)
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    // Check common su binary locations
    private fun checkSuBinaries(): Boolean {
        val paths = arrayOf(
            "/system/bin/su", "/system/xbin/su", "/sbin/su",
            "/su/bin/su", "/su/xbin/su", "/data/local/su",
            "/data/local/bin/su", "/data/local/xbin/su",
            "/system/sd/xbin/su", "/system/bin/failsafe/su",
            "/data/local/tmp/su", "/system/app/Superuser.apk"
        )
        return paths.any { File(it).exists() }
    }

    // Check for installed root management apps
    private fun checkDangerousApps(): Boolean {
        val rootApps = arrayOf(
            "com.topjohnwu.magisk",
            "eu.chainfire.supersu",
            "com.noshufou.android.su",
            "com.noshufou.android.su.elite",
            "com.koushikdutta.superuser",
            "com.thirdparty.superuser",
            "com.yellowes.su",
            "com.kingouser.com",
            "com.mgyun.shua.su",
            "com.m0narx.su",
            "com.kingroot.kinguser",
            "com.kingo.root",
            "com.smedialink.oneclickroot",
            "com.zhiqupk.root.global",
            "com.alephzain.framaroot"
        )
        val pm = reactContext.packageManager
        return rootApps.any { pkg ->
            try { pm.getPackageInfo(pkg, 0); true } catch (e: Exception) { false }
        }
    }

    // Test-keys in build tags indicate unofficial/rooted ROM
    private fun checkBuildTags(): Boolean {
        val tags = Build.TAGS
        return tags != null && tags.contains("test-keys")
    }

    // If /system is writable, the device is rooted
    private fun checkSystemWritable(): Boolean {
        return try {
            val file = File("/system/balakatha_write_test")
            val writable = file.createNewFile()
            if (writable) file.delete()
            writable
        } catch (e: Exception) {
            false
        }
    }

    // Check for apps that hide root (they can be installed on rooted devices)
    private fun checkRootCloakingApps(): Boolean {
        val cloakApps = arrayOf(
            "com.devadvance.rootcloak",
            "com.devadvance.rootcloakplus",
            "de.robv.android.xposed.installer",
            "com.saurik.substrate",
            "com.zachspong.temprootremovejb",
            "com.amphoras.hidemyroot",
            "com.formyhm.hiderootPremium"
        )
        val pm = reactContext.packageManager
        return cloakApps.any { pkg ->
            try { pm.getPackageInfo(pkg, 0); true } catch (e: Exception) { false }
        }
    }
}
