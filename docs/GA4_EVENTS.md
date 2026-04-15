# GA4 폼 이벤트 추적 가이드

## 개요

HERUE LAB 웹사이트의 CONTACT 폼에서 사용자 행동을 GA4(Google Analytics 4)로 추적하는 방법입니다.

---

## 이벤트 구조

### 1. form_start
**트리거:** 폼 페이지 로드 시 (1회)

**용도:** 폼을 본 사용자 수 측정

---

### 2. field_focus
**트리거:** 필드 클릭/포커스 시

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| field_name | 필드 이름 | schedule_start, company_name |

**추적되는 필드:**
- `schedule_start` - 시작일 클릭
- `schedule_end` - 종료일 클릭
- `consulting_date` - 컨설팅 날짜 클릭
- `budget` - 예산 슬라이더 드래그 시작
- `company_name` - 회사명 입력창 클릭
- `contact_person_name` - 담당자명 입력창 클릭
- `contact_number` - 연락처 입력창 클릭
- `email` - 이메일 입력창 클릭
- `project_requirement` - 프로젝트 요구사항 textarea 클릭

---

### 3. field_complete
**트리거:** 필드 입력 완료 시 (blur, 날짜 선택, 드래그 끝)

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| field_name | 필드 이름 | schedule_start |
| field_value | 입력된 값 (50자 제한) | 2026-05-01 |

**추적되는 필드:**
- `schedule_start` - 시작일 선택 완료
- `schedule_end` - 종료일 선택 완료
- `consulting_date` - 컨설팅 날짜 선택 완료
- `budget` - 예산 슬라이더 드래그 완료
- `company_name` - 회사명 입력 완료
- `contact_person_name` - 담당자명 입력 완료
- `contact_number` - 연락처 입력 완료
- `email` - 이메일 입력 완료
- `project_requirement` - 요구사항 입력 완료

---

### 4. select_* 이벤트

#### project_type_select
**트리거:** 연간/단기 프로젝트 유형 선택

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| value | 선택된 유형 | subscription / single |

---

#### detail_project_select
**트리거:** 세부 프로젝트 선택

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| value | 선택된 프로젝트들 | bxbi, package |

**세부 프로젝트:**
| value | 설명 |
|-------|------|
| total | 브랜드 디자인 토탈 운영 |
| edu | 교육 브랜드 디자인 운영 |
| sns | SNS 콘텐츠 디자인 운영 |
| amazon | 아마존 커머스 디자인 운영 |
| bxbi | BX/BI |
| package | 패키지 디자인 |
| marketing | 마케팅 디자인 |
| web | 홈페이지 제작 |
| space | 공간 브랜딩 |
| video | 영상 |
| ip | IP 캐릭터 개발 |

---

#### discover_path_select
**트리거:** 헤루랩을 알게된 경로 선택

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| value | 선택된 경로 | naver, google, instagram |

---

### 5. submit_* 이벤트

#### form_submit_click
**트리거:** 제출 버튼 클릭

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| project_type | 프로젝트 유형 | subscription |
| detail_projects | 세부 프로젝트 | bxbi, package |
| budget | 예산 (만원) | 500 |
| company | 회사명 | (입력값) |

---

#### form_submit_success
**트리거:** 폼 제출 성공 (실제 전송 성공 시)

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| project_type | 프로젝트 유형 | subscription |
| detail_projects | 세부 프로젝트 | bxbi, package |
| budget | 예산 (만원) | 500 |
| budget_label | 예산 표시 | 500만원 |
| company | 회사명 | (입력값) |
| discover_path | 알게된 경로 | naver |

---

### 6. privacy_check
**트리거:** 개인정보처리방침 동의 체크

**파라미터:** 없음

---

### 7. file_upload
**트리거:** 파일 첨부

**파라미터:**
| 파라미터 | 설명 | 예시 |
|----------|------|------|
| file_count | 첨부된 파일 수 | 2 |

---

## 이벤트 흐름도

```
┌─────────────────────────────────────────────────────────────┐
│                     폼 페이지 로드                            │
│                         │                                    │
│                    form_start                                │
│                         │                                    │
│    ┌────────────────────┼────────────────────┐              │
│    │                    │                    │              │
│    ▼                    ▼                    ▼              │
│ project_type_select   field_focus      schedule_start      │
│    │                    │                    │              │
│    ▼                    ▼                    ▼              │
│ detail_project_select  field_complete   schedule_end        │
│                                                     │      │
│                         ┌─────────────────────────┘      │
│                         │                                  │
│                         ▼                                  │
│                    budget (드래그)                          │
│                         │                                  │
│                         ▼                                  │
│               budget_input_complete                        │
│                         │                                  │
│    ┌────────────────────┼────────────────────┐              │
│    │                    │                    │              │
│    ▼                    ▼                    ▼              │
│ company_name       contact_number         email             │
│    │                    │                    │              │
│    └────────────────────┴────────────────────┘              │
│                         │                                  │
│                    privacy_check                            │
│                         │                                  │
│                         ▼                                  │
│                  form_submit_click                         │
│                         │                                  │
│                         ▼                                  │
│                form_submit_success                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 구현 파일

### js/ga4-events.js
GA4 이벤트 추적 함수 정의 파일

**주요 함수:**
```javascript
// 초기화
initGA()                           // 페이지 뷰

// 폼 추적
trackFormStart()                   // 폼 시작
trackFieldFocus(fieldName)         // 필드 포커스
trackFieldComplete(fieldName, value) // 필드 완료

// 선택 추적
trackProjectTypeSelect(type)       // 프로젝트 유형
trackDetailProjectSelect(project)  // 세부 프로젝트
trackDiscoverPath(path)            // 경로
trackPrivacyCheck()                // 개인정보 동의
trackConsultingDate(date)         // 컨설팅 날짜

// 제출 추적
trackFormSubmitClick(data)         // 제출 클릭
trackFormSubmitSuccess(data)       // 제출 성공

// 파일
trackFileUpload(count)             // 파일 첨부
trackBudgetComplete(value)         // 예산 완료
```

---

## 디버그 확인 방법

### 1. 브라우저 콘솔
- F12 → Console 탭
- `📊 GA4 Event:` 로그 확인

### 2. GA4 DebugView
1. https://analytics.google.com 접속
2. DebugView 메뉴 선택
3. 실시간 이벤트 확인

### 3. GA4 Debugger 확장 프로그램
1. Chrome 확장 프로그램 설치
2. Debug On으로 변경
3. 페이지 조작 시 DebugView에 실시간 표시

---

## 주의사항

1. **중복 방지**: budget 추적은 드래그 중이 아닌 드래그 **끝날 때** 1회만 발생
2. **값 제한**: field_value는 50자까지만 전송
3. **선택적 추적**: privacy_check, file_upload는 해당 action 없을 경우 미발생
