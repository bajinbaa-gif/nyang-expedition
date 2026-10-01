# 냥냥 탐험대 — 앱 빌드 안내

이 저장소 하나로 두 가지가 만들어져요.

- **아이폰·PC용 웹 링크**: GitHub Pages가 `www` 폴더를 공개 사이트로 올려요.
- **안드로이드 앱**: GitHub Actions가 플레이스토어용 AAB와 테스트용 APK를 빌드해요.

## 1. 저장소 만들기
1. GitHub에서 새 저장소를 **Public**으로 만들어요. 이름은 예를 들어 `nyang-expedition`으로 해요.
2. 이 폴더의 파일을 모두 올려요. `.github` 폴더도 꼭 같이 올려야 해요.

## 2. 서명 키 등록 (한 번만)
저장소의 **Settings → Secrets and variables → Actions → New repository secret**에서 아래 4개를 등록해요. 값은 따로 받은 `nyang-signing` 폴더에 들어 있어요.

| 이름 | 값 |
|---|---|
| `KEYSTORE_BASE64` | `KEYSTORE_BASE64.txt` 파일 내용 전체 |
| `KEYSTORE_PASSWORD` | `passwords.txt`의 KEYSTORE_PASSWORD |
| `KEY_PASSWORD` | `passwords.txt`의 KEY_PASSWORD |
| `KEY_ALIAS` | `upload` |

`upload.jks`와 비밀번호는 잃어버리면 앱을 업데이트할 수 없어요. 꼭 따로 백업해 두세요.

## 3. 아이폰 링크 켜기
1. **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꿔요.
2. **Actions** 탭에서 "웹 버전 배포 (아이폰 링크)"를 실행해요.
3. 링크는 `https://<깃허브아이디>.github.io/<저장소이름>/` 형태로 생겨요.
4. 아이폰 사파리에서 열고 **공유 → 홈 화면에 추가**를 누르면 앱처럼 전체 화면으로 실행돼요.

## 4. 안드로이드 앱 빌드
1. **Actions → 안드로이드 앱 빌드 → Run workflow**를 눌러요. `main`에 푸시해도 자동으로 빌드돼요.
2. 빌드가 끝나면 실행 화면 아래 **Artifacts**에서 zip을 받아요.
   - `app-release.aab`: 플레이 콘솔에 올리는 파일
   - `app-release.apk`: 휴대폰이나 에뮬레이터에 바로 설치해 보는 파일

## 5. 광고 붙이기 (AdMob)
1. AdMob에서 앱(Android)을 만들고 **보상형** 광고 단위를 하나 만들어요.
2. `admob.json`의 `appId`(물결 `~`이 있는 값)와 `rewardedId`(슬래시 `/`가 있는 값)를 바꾸고, `test`를 `false`로 바꿔요.
3. 다시 빌드하면 실제 광고가 나와요. 지금 들어 있는 값은 구글 공식 테스트 ID라서 테스트 광고만 나와요.

## 6. 플레이 콘솔 등록할 때
- 패키지 이름: `com.bandosangin.nyangexpedition`
- 개인정보처리방침 URL: `https://<깃허브아이디>.github.io/<저장소이름>/privacy.html` (문의 이메일을 먼저 채워 주세요)
- 데이터 보안 설문: 광고 ID 수집 "예" (AdMob)
- 광고 포함: "예"
- 플레이 콘솔이 더 높은 타깃 SDK를 요구하면 **Settings → Variables**에 `TARGET_SDK`(예: `36`)를 추가하고 다시 빌드해요.

## 게임을 고친 뒤
`www/index.html`을 바꿔서 올리면 웹 링크와 앱이 함께 새로 빌드돼요. 웹 캐시를 새로 받게 하려면 `www/sw.js`의 `VERSION` 숫자도 올려 주세요.
