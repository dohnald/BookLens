# 📚 BookLens (북렌즈)

> **"내 시간은 소중하니까."**
> 온라인 서점(알라딘, Yes24, 교보문고)에서 원치 않는 출판사, 저자를 시각적으로 차단(Filtering)하여 탐색 시간을 절약해주는 크롬 확장 프로그램입니다.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 주요 기능 (Key Features)

### 1. 🚫 원치 않는 도서 필터링 (Blocking)
- **출판사 및 저자 차단:** 서점 리스트에서 보기 싫은 출판사나 저자의 책을 숨깁니다.
- **간편한 차단:** 책 목록 옆에 생기는 `[🚫]` 버튼을 클릭하면 즉시 차단 목록에 추가됩니다.
- **접기(Collapse) UI:** 차단된 책을 완전히 삭제하여 레이아웃을 망가뜨리는 대신, 얇은 띠 형태로 "접어둡니다". 궁금하다면 클릭해서 내용을 다시 확인할 수 있습니다.

### 2. 🛡️ 하이브리드 차단 목록
- **개인 목록 (Personal):** 사용자가 직접 차단한 목록 (브라우저 동기화).
- **공용 목록 (Public):** 스팸성 출판사나 저품질 도서 양산 출판사를 모아둔 공용 리스트를 구독하여 적용할 수 있습니다.

## 🛠 지원 서점 (Supported Sites)
현재 다음 온라인 서점의 검색 결과 및 리스트 페이지를 지원합니다.

- **알라딘 (Aladin)**
- **Yes24**
- **교보문고 (Kyobo)**

---

## 📥 설치 방법 (Installation)

이 프로그램은 Chrome Web Store에 등록되지 않았으며, 개발자 모드(Developer Mode)를 통해 직접 설치해야 합니다.

### 1단계: 소스 코드 다운로드
1. 이 저장소(Repository)의 우측 [Releases] 버튼을 클릭하고 [Download ZIP]을 선택합니다.
2. 다운로드한 ZIP 파일의 압축을 **해제**합니다. (폴더 위치를 기억해두세요)

### 2단계: 크롬 확장 프로그램 메뉴 접속
1. 크롬 브라우저 주소창에 `chrome://extensions` 를 입력하고 엔터를 칩니다.
2. 또는 우측 상단 점 3개 메뉴 `⋮` > **확장 프로그램** > **확장 프로그램 관리**로 들어갑니다.

### 3단계: 개발자 모드 켜기
1. 화면 우측 상단에 있는 **개발자 모드 (Developer mode)** 토글 스위치를 **켭니다(ON)**.

### 4단계: 확장 프로그램 로드
1. 상단에 생긴 버튼 중 **[압축 해제된 확장 프로그램을 로드합니다 (Load unpacked)]** 버튼을 클릭합니다.
2. **1단계**에서 압축을 해제했던 `BookLens` 폴더를 선택합니다.
3. 목록에 `BookLens` 카드가 생겼다면 설치 완료! 🎉

---

## 📖 사용 방법 (Usage)

1. **차단하기:** 온라인 서점 검색 결과에서 출판사/저자 이름 옆의 `[🚫]` 버튼을 클릭하세요.
2. **차단 해제:**
    - 접힌(Collapsed) 도서 영역을 클릭하면 일시적으로 내용이 보입니다.
    - 영구적으로 차단을 해제하려면 브라우저 우측 상단 `BookLens` 아이콘을 클릭하여 팝업 메뉴에서 목록을 관리하세요.
3. **옵션 설정:** 팝업 메뉴에서 '공용 차단 목록 사용 여부' 등을 설정할 수 있습니다.

---

## 🏗️ 개발 및 기여 (Development)

### 폴더 구조
```text
/
├── manifest.json        # 설정 파일
├── icons/               # 아이콘 이미지
├── popup/               # 팝업 UI (HTML/JS/CSS)
├── scripts/             # 핵심 로직
│   ├── background.js    # 백그라운드 작업 (공용 DB 페치 등)
│   ├── content.js       # 페이지 내 필터링 및 UI 조작
│   ├── selectors.js     # 사이트별 DOM 선택자 관리
│   └── utils.js         # 유틸리티 함수
└── data/                # 데이터 파일
```

### 기여하기
버그 제보나 기능 제안은 [Issues](https://github.com/USERNAME/BookLens/issues) 탭을 이용해 주세요.

## 📄 라이선스 (License)
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
