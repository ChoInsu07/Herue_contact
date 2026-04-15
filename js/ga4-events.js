/**
 * GA4 이벤트 추적 (Google Analytics 4)
 * 
 * 사용 방법:
 * 1. HTML에 gtag.js 추가 (한 번만)
 * 2. 이 파일을 script로 로드
 * 
 * 이벤트 구조:
 * - form_start       : 폼 로드
 * - field_focus     : 필드 클릭/포커스
 * - field_complete   : 필드 입력 완료
 * - select_*         : 선택 이벤트
 * - submit_*        : 제출 이벤트
 */

// 전역 dataLayer 초기화 (이미 gtag.js에서 초기화되어 있으면 무시)
window.dataLayer = window.dataLayer || [];

/**
 * GA4 이벤트 전송 함수
 * @param {string} eventName - 이벤트 이름
 * @param {object} params - 이벤트 파라미터
 */
function trackGA(eventName, params = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, params);
        console.log('📊 GA4 Event:', eventName, params);
    } else {
        console.warn('⚠️ gtag not loaded:', eventName, params);
    }
}

/**
 * GA4 초기화 (페이지 로드 시 호출)
 */
function initGA() {
    trackGA('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

// ============================================
// 폼 추적 이벤트
// ============================================

/**
 * 폼 시작 추적 (페이지 로드 또는 첫 포커스 시)
 */
function trackFormStart() {
    trackGA('form_start');
}

/**
 * 필드 포커스 추적
 * @param {string} fieldName - 필드 이름
 */
function trackFieldFocus(fieldName) {
    trackGA('field_focus', {
        field_name: fieldName
    });
}

/**
 * 필드 완료 추적
 * @param {string} fieldName - 필드 이름
 * @param {string} value - 필드 값 (선택적, 50자 제한)
 */
function trackFieldComplete(fieldName, value = '') {
    trackGA('field_complete', {
        field_name: fieldName,
        field_value: value.substring(0, 50)
    });
}

// ============================================
// 선택 이벤트
// ============================================

/**
 * 프로젝트 유형 선택
 * @param {string} type - 'subscription' 또는 'single'
 */
function trackProjectTypeSelect(type) {
    trackGA('project_type_select', {
        project_type: type
    });
}

/**
 * 세부 프로젝트 선택
 * @param {string} project - 선택된 프로젝트
 */
function trackDetailProjectSelect(project) {
    trackGA('detail_project_select', {
        selected_project: project
    });
}

/**
 * 예산 입력 완료
 * @param {number} value - 예산 값 (만원)
 */
function trackBudgetComplete(value) {
    trackGA('budget_input_complete', {
        budget_value: value,
        budget_label: value >= 5000 ? '5000만원+' : value + '만원'
    });
}

/**
 * 파일 첨부
 * @param {number} count - 첨부 파일 수
 */
function trackFileUpload(count) {
    trackGA('file_upload', {
        file_count: count
    });
}

/**
 * 개인정보 동의
 */
function trackPrivacyCheck() {
    trackGA('privacy_check');
}

/**
 * 경로 선택
 * @param {string} path - 선택된 경로
 */
function trackDiscoverPath(path) {
    trackGA('discover_path_select', {
        discover_path: path
    });
}

/**
 * 컨설팅 날짜 선택
 * @param {string} date - 선택된 날짜
 */
function trackConsultingDate(date) {
    trackGA('consulting_date_complete', {
        consulting_date: date
    });
}

/**
 * 프로젝트 필터 선택 (PROJECT 페이지)
 * @param {string} filter - 필터 값
 */
function trackProjectFilter(filter) {
    trackGA('filter_projects', {
        filter_category: filter
    });
}

/**
 * 프로젝트 카드 클릭 (PROJECT 페이지)
 * @param {string} category - 프로젝트 카테고리
 * @param {string} title - 프로젝트 제목
 */
function trackProjectClick(category, title) {
    trackGA('view_project', {
        project_category: category,
        project_title: title
    });
}

// ============================================
// 제출 이벤트
// ============================================

/**
 * 폼 제출 클릭
 * @param {object} formData - 폼 데이터
 */
function trackFormSubmitClick(formData) {
    trackGA('form_submit_click', {
        project_type: formData.project_type || '',
        detail_projects: formData.detail_projects || '',
        budget: formData.budget || 0,
        company: formData.company || ''
    });
}

/**
 * 폼 제출 성공
 * @param {object} formData - 폼 데이터
 */
function trackFormSubmitSuccess(formData) {
    trackGA('form_submit_success', {
        project_type: formData.project_type || '',
        detail_projects: formData.detail_projects || '',
        budget: formData.budget || 0,
        budget_label: formData.budget_label || '',
        company: formData.company || '',
        discover_path: formData.discover_path || ''
    });
}

// ============================================
// 이벤트 리스너 자동 등록 (선택적)
// ============================================

/**
 * 폼에 자동으로 이벤트 리스너 등록
 * @param {string} formSelector - 폼 셀렉터
 */
function autoTrackForm(formSelector = 'form') {
    let formStartTracked = false;
    const form = document.querySelector(formSelector);
    
    if (!form) return;
    
    // 폼 내 모든 입력 요소에 focus/blur 이벤트
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            // 폼 시작 트래킹 (한 번만)
            if (!formStartTracked) {
                trackFormStart();
                formStartTracked = true;
            }
            
            const name = input.name || input.id || input.placeholder || 'unknown';
            trackFieldFocus(name);
        });
        
        input.addEventListener('blur', () => {
            if (input.value && input.value.length > 0) {
                const name = input.name || input.id || input.placeholder || 'unknown';
                trackFieldComplete(name, input.value);
            }
        });
    });
    
    // 폼 제출 이벤트
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        trackFormSubmitClick(data);
        
        // 폼 처리 로직...
        // 성공 후 trackFormSubmitSuccess(data) 호출
    });
}

// 초기화 (DOM 로드 후)
document.addEventListener('DOMContentLoaded', () => {
    // 필요시 자동 폼 추적 활성화
    // autoTrackForm('#contactForm');
});
