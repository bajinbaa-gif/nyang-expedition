// 안드로이드 프로젝트 자동 설정: AdMob ID, 버전, 세로 고정, 서명
import fs from 'node:fs';
const ad = JSON.parse(fs.readFileSync('admob.json', 'utf8'));
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// 1) 웹 광고 설정
fs.writeFileSync('www/ad-config.js',
  `window.AD_CONFIG=${JSON.stringify({ rewardedId: ad.rewardedId, test: !!ad.test })};\n`);

// 2) AndroidManifest: AdMob 앱 ID + 세로 화면
const mf = 'android/app/src/main/AndroidManifest.xml';
let m = fs.readFileSync(mf, 'utf8');
if (!m.includes('com.google.android.gms.ads.APPLICATION_ID')) {
  m = m.replace(/<application([^>]*)>/, (all) => `${all}\n        <meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="${ad.appId}"/>`);
} else {
  m = m.replace(/(com\.google\.android\.gms\.ads\.APPLICATION_ID"\s+android:value=")[^"]*"/, `$1${ad.appId}"`);
}
if (!m.includes('android:screenOrientation')) {
  m = m.replace(/<activity\b/, '<activity android:screenOrientation="portrait"');
}
fs.writeFileSync(mf, m);

// 3) 버전 + 서명
const bg = 'android/app/build.gradle';
let g = fs.readFileSync(bg, 'utf8');
const code = process.env.VERSION_CODE || process.env.GITHUB_RUN_NUMBER || '1';
g = g.replace(/versionCode\s+\d+/, `versionCode ${code}`);
g = g.replace(/versionName\s+"[^"]*"/, `versionName "${pkg.version}"`);
if (process.env.KEYSTORE_PASSWORD && !g.includes('signingConfigs.release')) {
  g += `
android {
    signingConfigs {
        release {
            storeFile file("upload.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD")
            keyAlias System.getenv("KEY_ALIAS")
            keyPassword System.getenv("KEY_PASSWORD")
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
`;
}
fs.writeFileSync(bg, g);

// 4) (선택) 타깃 SDK 올리기 — 플레이 콘솔이 더 높은 버전을 요구하면 저장소 변수 TARGET_SDK 를 설정
const vg = 'android/variables.gradle';
if (process.env.TARGET_SDK && fs.existsSync(vg)) {
  let v = fs.readFileSync(vg, 'utf8');
  v = v.replace(/targetSdkVersion\s*=\s*\d+/, `targetSdkVersion = ${process.env.TARGET_SDK}`)
       .replace(/compileSdkVersion\s*=\s*\d+/, `compileSdkVersion = ${process.env.TARGET_SDK}`);
  fs.writeFileSync(vg, v);
}
console.log('patched: versionCode', code, 'admob', ad.test ? '(test ids)' : '(real ids)');
