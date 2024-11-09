//
// Created on 2024/5/6.
//
// Node APIs are not fully supported. To solve the compilation error of the interface cannot be found,
// please include "napi/native_api.h".

#ifndef APSECDEMO_BLUESHIELDTRUSTEDTERMINALINTERFACE_H
#define APSECDEMO_BLUESHIELDTRUSTEDTERMINALINTERFACE_H

#include <stddef.h>
#include <stdint.h>

// Module 0, 静态密钥存储
typedef struct _BlueShieldStaticStoreModule {
    const char *(*GetCustomData)(const char *appKey, const char *authName);
} BlueShieldStaticStoreModule;

// Module 1, 静态加解密
typedef enum _BlueShieldStaticCryptoMode {
    BS_STATIC_CRYPTO_MODE_SG_AES_128 = 16,
    BS_STATIC_CRYPTO_MODE_BS_SM4_GCM = 32,
    BS_STATIC_CRYPTO_MODE_BS_AES_128 = 33,
} BlueShieldStaticCryptoMode;

typedef struct _BlueShieldStaticCryptoModule {
    int (*Encrypt)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode, uint8_t *inData,
                   size_t inLen, uint8_t **outData, size_t *outLen);
    int (*Decrypt)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode, uint8_t *inData,
                   size_t inLen, uint8_t **outData, size_t *outLen);
    int (*EncryptBase64)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode, uint8_t *inData,
                         size_t inLen, uint8_t **outData, size_t *outLen);
    int (*DecryptBase64)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode, uint8_t *inData,
                         size_t inLen, uint8_t **outData, size_t *outLen);
    int (*EncryptStringBase64)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode,
                               const char *inData, const char **outData);
    int (*DecryptStringBase64)(BlueShieldStaticCryptoMode mode, const char *appKey, const char *authCode,
                               const char *inData, const char **outData);
} BlueShieldStaticCryptoModule;

// Module 3, 动态加解密
typedef struct _BlueShieldDynamicCryptoModule {
    int (*Encrypt)(uint8_t *inData, size_t inLen, uint8_t **outData, size_t *outLen);
    int (*Decrypt)(uint8_t *inData, size_t inLen, uint8_t **outData, size_t *outLen);
    int (*EncryptStringBase64)(const char *inData, const char **outData);
    int (*DecryptStringBase64)(const char *inData, const char **outData);
} BlueShieldDynamicCryptoModule;

// Module 7, 可信签名
typedef enum _BS_TRUSTED_SIGN_TYPE {
    SECURITY_GUARD_MD5 = 0,
    SECURITY_GUARD_HMAC_SHA1 = 1,
    // SECURITY_GUARD_ATLAS       = 2,
    // SECURITY_GUARD_AVMP        = 3,
    TRUSTED_SIGN_NORMAL = 4,
} BS_TRUSTED_SIGN_TYPE;

typedef enum _BS_TRUSTED_SIGN_ENV {
    TRUSTED_SIGN_ENV_ONLINE = 0,
    TRUSTED_SIGN_ENV_DEV = 1,
    TRUSTED_SIGN_ENV_PRE = 2,
} BS_TRUSTED_SIGN_ENV;

typedef struct _TrustedSignParam {
    const char *appKey;
    const char *authCode;
    const char *signAPI;
    uint8_t *signData;
    size_t signDataLength;
    BS_TRUSTED_SIGN_ENV signEnv;
    BS_TRUSTED_SIGN_TYPE signType;
} *TrustedSignParam;

typedef struct _TrustedSignResult {
    const char *token;
    const char *sign;
    const char *color;
} *TrustedSignResult;

typedef struct _TrustedSignatureModule {
    int (*CreateParam)(TrustedSignParam *signParam);
    int (*ReleaseParam)(TrustedSignParam *signParam);
    int (*GetSign)(TrustedSignParam signParam, TrustedSignResult *signResult);
    int (*ReleaseSign)(TrustedSignResult *signResult);
} TrustedSignatureModule;

#endif // APSECDEMO_BLUESHIELDTRUSTEDTERMINALINTERFACE_H
