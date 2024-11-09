//
// Created on 2024/1/25.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef APSECDEMO_BLUESHIELDMANAGER_H
#define APSECDEMO_BLUESHIELDMANAGER_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum _BlueShieldModuleType {
    // Trusted Terminal
    BS_STATIC_STORE_MODULE = 0,
    BS_STATIC_CRYPTO_MODULE = 1,
    BS_ENVELOPE_CRYPTO_MODULE = 2,
    BS_DYNAMIC_CRYPTO_MODULE = 3,
    BS_SAFE_SIGNATURE_MODULE = 4,
    BS_SAFE_OTP_MODULE = 5,
    BS_TRUSTED_SIGNATURE_MODULE = 6,
    BS_TRUSTED_ENGINE_MODULE = 7,
    BS_DEVICE_FEATURE_MODULE = 8,

    // Aliapy Device ID
    BS_APDID_MODULE = 16,

    // Security Flow
    BS_RDS_MODULE = 32,
    BS_DEVICE_COLOR_MODULE = 33,
    BS_CAPTCHA_MODULE = 34,

    // Edge Risk Control
    BS_EDGE_RISK_MODULE = 48
} BlueShieldModuleType;

typedef struct _BlueShieldManager {
    int (*Init)(const char *authCode, const char *workPath, uint8_t *imageData, size_t imageLen, const char *pkgName,
                const char *pkgSign, const char *extParams);
    void *(*GetModule)(BlueShieldModuleType moduleType);
} BlueShieldManager;

// 获取蓝盾单例
__attribute__((visibility("default"))) BlueShieldManager *BlueShieldGetManager();

#ifdef __cplusplus
}
#endif

#endif //APSECDEMO_BLUESHIELDMANAGER_H
