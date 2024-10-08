let filters = {
    evolution: [],
    type: [],
    skill: [],
    strong: [],
    weak: [],
    field: [],
    // 추가 필터를 여기에 추가할 수 있습니다.
};
let isAscending = true; // 정렬 방향 상태

// CSV 파일을 불러오는 함수
async function loadCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    const rows = text.split('\n').slice(1); // 헤더를 제외하고 데이터만 가져옴
    return rows.map(row => {
        const columns = row.split(',');
        return {
            name: columns[10],   // 캐릭터 이름
            타수: columns[13],   // 타수
            범위: columns[14],   // 범위
            속성: columns[15],  // 속성
            effect: columns[18],
            additionalTurn: columns[19]   
        };
    });
}

// 메인 CSV 파일과 skill1.csv, skill2.csv, skill3.csv를 불러와 테이블에 데이터를 입력하는 함수
async function fetchCSV() {
    // 각 스킬의 데이터를 각각의 CSV 파일에서 불러옴
    const [skill1Data, skill2Data, skill3Data] = await Promise.all([
        loadCSV('skill1.csv'),
        loadCSV('skill2.csv'),
        loadCSV('skill3.csv')
    ]);

    const response = await fetch('characters.csv'); // characters.csv 파일 불러오기
    const text = await response.text();
    const rows = text.split('\n').slice(1);

    const tableBody = document.getElementById('characterTable');
    tableBody.innerHTML = ''; // 이전 데이터 초기화

    rows.forEach(row => {
        const columns = row.split(',');
        const name = columns[0];  // 캐릭터 이름
        const evolution = columns[1];
        const type = columns[2];
        const level = columns[3];
        const HP = columns[4];
        const SP = columns[5];
        const 힘 = columns[6];
        const 지능 = columns[7];
        const 수비 = columns[8];
        const 저항 = columns[9];
        const 속도 = columns[10];
        const 강점 = columns[11];
        const 강점효과 = columns[12];
        const 약점 = columns[13];
        const 약점효과 = columns[14];
        const 필드1 = columns[15];
        const 필드2 = columns[16];
        const 필드3 = columns[17];

        
        // 타입에 따른 이미지 경로 설정
        const typeImagePath = `image/${type}.webp`; // 타입에 따라 이미지 경로 설정

        // 강점과 약점을 스킬처럼 간결하게 처리
        const strongHtml = 강점 
             ? `<img src="image/${강점}.webp" alt="${강점}" title="${강점}" style="width: 25px; height: 25px; vertical-align: middle; background-image: url('image/strongbackground.webp'); background-size: 120%; background-position: center;"> <span>${강점효과 ? 강점효과 : ''}</span>`
            : ''; // 강점 이미지와 효과를 표시, 없으면 빈 값

        const weakHtml = 약점 
            ? `<img src="image/${약점}.webp" alt="${약점}" title="${약점}" style="width: 25px; height: 25px; vertical-align: middle; background-image: url('image/weakbackground.webp'); background-size: 120%; background-position: center;"> <span>${약점효과 ? 약점효과 : ''}</span>`
            : ''; // 약점 이미지와 효과를 표시, 없으면 빈 값

        // 필드 이미지 경로 설정 (존재하는 경우에만 이미지 표시)
        const fieldImages = [
            필드1 ? `<img src="image/field/${필드1}.webp" alt="${필드1}" title="${필드1}" style="width: 25px; height: 25px;">` : '',
            필드2 ? `<img src="image/field/${필드2}.webp" alt="${필드2}" title="${필드2}" style="width: 25px; height: 25px;">` : '',
            필드3 ? `<img src="image/field/${필드3}.webp" alt="${필드3}" title="${필드3}" style="width: 25px; height: 25px;">` : ''
        ];

        // 필드 이미지를 조합
        const fieldsHtml = fieldImages.filter(Boolean).join(''); // 빈 문자열을 필터링하여 조합

        // 각 스킬 데이터를 skill1.csv, skill2.csv, skill3.csv에서 찾아서 추가
        const skill1 = skill1Data.find(skill => skill.name === name); // 캐릭터 이름을 기준으로 매칭
        const skill2 = skill2Data.find(skill => skill.name === name); // 캐릭터 이름을 기준으로 매칭
        const skill3 = skill3Data.find(skill => skill.name === name); // 캐릭터 이름을 기준으로 매칭
        
        // 타수 값을 확인하고 숫자인 경우만 "타"를 붙임
        const format타수 = (타수) => {
            return isNaN(타수) || 타수 === "" ? 타수 : `${타수}타`;
        };

        // 스킬1, 스킬2, 스킬3 데이터를 테이블에 추가 (속성을 기준으로 이미지 및 텍스트)
        const skillHtml = (skill, skillNumber, digimonName) => {
            if (!skill) return '<td></td>'; // 스킬이 없으면 빈 td 반환
            
            let backgroundColor = '';
            if (skill.additionalTurn) {
                backgroundColor = 'background-color: rgb(255,234,234);';
            }

            const effectDescriptions = {
                "출혈": "* 출혈<br>공격 시 65% 확률로 발생됩니다.<br>턴마다 지속 피해를 입힙니다.<br>물리속성에 취약해집니다.<br>힐을 받을 경우 해제됩니다.",
                "화상": "* 화상<br>공격 시 65% 확률로 발생됩니다.<br>턴마다 지속 피해를 입힙니다.<br>바람속성에 취약해집니다.<br>물속성 피격 시 해제됩니다.",
                "중독": "* 중독<br>공격 시 65% 확률로 발생됩니다.<br>턴마다 지속 피해를 입힙니다.<br>어둠속성에 취약해집니다.<br>불속성 피격 시 해제됩니다.",
                "감전": "* 감전<br>공격 시 65% 확률로 발생됩니다.<br>턴마다 지속 피해를 입힙니다.<br>물속성에 취약해집니다.<br>나무속성 피격 시 해제됩니다.",
                "빙결": "* 빙결<br>공격 시 x% 확률로 발생됩니다.<br>일정 턴 동안 행동이 불가해집니다.<br>천둥속성에 취약해집니다.<br>천둥속성 피격 시 해제됩니다.",
                "석화": "* 석화<br>공격 시 x% 확률로 발생됩니다.<br>일정 턴 동안 행동이 불가해집니다.<br>강철속성에 취약해집니다.<br>강철속성 피격 시 해제됩니다.",
                "격리": "* 격리<br>공격 시 x% 확률로 발생됩니다.<br>일정 턴 동안 행동이 불가해집니다.<br>빛속성에 취약해집니다.<br>빛속성 피격 시 해제됩니다.",
                "스턴": "* 스턴<br>공격 시 x% 확률로 발생됩니다.<br>일정 턴 동안 행동이 불가해집니다.",
                "연소": "* 연소<br>공격 시 65% 확률로 발생됩니다.<br>턴마다 대상의 SP를 추가로 소모시킵니다.<br>스킬 레벨이 오를수록 소모량이 증가합니다.",
                "매료": "* 매료<br>공격 시 x% 확률로 발생됩니다.<br>일정 턴 동안 명령이 불가해집니다.<br>피아식별 없이 행동하게 됩니다.",
                "방어력 감소": "* 방어력 감소<br>공격 시 65% 확률로 발생됩니다.<br>일정 턴 동안 DEF x% 감소",
                "방어력 증가": "* 방어력 증가<br>일정 턴 동안 DEF x% 증가",
                "공격력 증가": "* 공격력 증가<br>일정 턴 동안 STR x% 증가",
                "속도 감소": "* 속도 감소<br>공격 시 65% 확률로 발생됩니다.<br>일정 턴 동안 SPD x% 감소",
                "속도 증가": "* 속도 증가<br>일정 턴 동안 SPD x% 증가",
                "치명타율 증가": "* 치명타율 증가<br>일정 턴 동안 치명타율 x% 증가",
                "회복": "* 회복"
            };

            // 스킬 효과 이미지와 툴팁 추가
            // skill.effect가 undefined가 아닌지 확인 후 trim() 처리
            const normalizedEffect = skill.effect ? skill.effect.trim().toLowerCase() : ''; // skill.effect가 없을 경우 빈 문자열 처리

            const effectDescriptionsLower = Object.keys(effectDescriptions).reduce((acc, key) => {
                acc[key.toLowerCase()] = effectDescriptions[key];
                return acc;
            }, {});

            // 변환된 effect로 설명 찾기
            const effectDescription = normalizedEffect && effectDescriptionsLower[normalizedEffect]
                ? effectDescriptionsLower[normalizedEffect]
                : '효과 설명을 찾을 수 없습니다.'; // 일치하는 효과가 없으면 기본 값 설정
            
            let effectImagePath = skill.effect ? `image/debuff/${skill.effect}.webp` : ''; // 효과 이미지 경로 설정
                // 회복 효과일 경우 스킬 이미지를 사용
            if (normalizedEffect === '회복') {
                // 디지몬 스킬 이미지 경로 설정
                effectImagePath = `image/digimon/${digimonName}/skill${skillNumber}.webp`;
            }
            
            // 효과가 있을 때만 툴팁을 생성
            const effectTooltipHtml = skill.effect && effectDescription 
                ? `<div class="tooltip" style="display: inline-block; vertical-align: middle;">
                       <img src="${effectImagePath}" alt="${skill.effect}" style="width: 23px; height: 23px; vertical-align: middle; border-radius: 50%;">
                       <div class="tooltiptext">
                           <div class="tooltip-content">
                               <img src="${effectImagePath}" alt="${skill.effect} 이미지" style="width: 30px; height: 30px; border-radius: 50%;">
                               <div class="tooltip-description">
                                   ${effectDescription}
                               </div>
                           </div>
                       </div>
                   </div>`
                : ''; // 효과가 없으면 빈 값을 반환
                
            // 최종적으로 테이블 셀에 속성 이미지와 effect 이미지, 타수를 넣음
            return `
                <td style="${backgroundColor}">
                    <!-- 속성 이미지 -->
                    <img src="image/${skill.속성}.webp" alt="${skill.속성}" title="${skill.속성}" 
                        style="width: 25px; height: 25px; vertical-align: middle; background-image: url('image/background.webp'); 
                        background-size: 120%; background-position: center;">
                    
                    <!-- 이펙트 이미지 (툴팁 포함) -->
                    ${effectTooltipHtml}
            
                    <!-- 타수 / 범위 정보 -->
                    <span>${format타수(skill.타수)} / ${skill.범위}</span>
                </td>
            `;
            
            
        };

        // 캐릭터 이름에 있는 특수 문자를 안전한 문자로 변환
        const sanitizedName = name.replace(/[:]/g, '_'); // ':'를 '_'로 대체

        // 캐릭터 이미지 경로 설정 (image/digimon 폴더 내에 캐릭터 이름을 파일명으로 사용)
        const characterImagePath = `image/digimon/${sanitizedName}/${sanitizedName}.webp`;

        const newRow = document.createElement('tr');
        newRow.dataset.name = name; // 이름 데이터 속성 추가
        newRow.dataset.evolution = evolution; // 진화 단계 데이터 속성 추가
        newRow.dataset.type = type; // 타입 데이터 속성 추가
        newRow.dataset.level = level; // 레벨 데이터 속성 추가
        newRow.dataset.hp = HP; // HP 데이터 속성 추가
        newRow.dataset.sp = SP; // SP 데이터 속성 추가
        newRow.dataset.힘 = 힘; // 힘 데이터 속성 추가
        newRow.dataset.지능 = 지능; // 지능 데이터 속성 추가
        newRow.dataset.수비 = 수비; // 수비 데이터 속성 추가
        newRow.dataset.저항 = 저항; // 저항 데이터 속성 추가
        newRow.dataset.속도 = 속도; // 속도 데이터 속성 추가
        newRow.dataset.강점 = 강점; // 강점 데이터 속성 추가
        newRow.dataset.강점효과 = 강점효과; // 강점 효과 데이터 속성 추가
        newRow.dataset.약점 = 약점; // 약점 데이터 속성 추가
        newRow.dataset.약점효과 = 약점효과; // 약점 효과 데이터 속성 추가
        newRow.dataset.필드1 = 필드1; // 필드1 데이터 속성 추가
        newRow.dataset.필드2 = 필드2; // 필드2 데이터 속성 추가
        newRow.dataset.필드3 = 필드3; // 필드3 데이터 속성 추가
        newRow.innerHTML = `
            <td>
                <div style="width: 25px; height: 25px; background-color: black; display: inline-block; vertical-align: middle;">
                    <img src="${characterImagePath}" alt="${name}" title="${name}" style="width: 100%; height: 100%;" onerror="this.src='image/digimon/default.webp';">
                </div> 
                <!-- 캐릭터 이름을 링크로 추가 -->
                <a href="character-detail.html?name=${encodeURIComponent(name)}" style="text-decoration: none; color: black;">${name}</a> <!-- 링크 추가 -->
            </td>
            <td style="text-align: center; vertical-align: middle;">${level}</td>
            <td style="text-align: center; vertical-align: middle;">${evolution}</td>
            <td style="text-align: center; vertical-align: middle;">
                <img src="${typeImagePath}" alt="${type}" title="${type}" style="width: 23px; height: 23px; display: block; margin: 0 auto;">
            </td>
            <td style="text-align: center; vertical-align: middle; border-left: 2px solid darkgrey;">${HP}</td>
            <td style="text-align: center; vertical-align: middle;">${SP}</td>
            <td style="text-align: center; vertical-align: middle;">${힘}</td>
            <td style="text-align: center; vertical-align: middle;">${지능}</td>
            <td style="text-align: center; vertical-align: middle;">${수비}</td>
            <td style="text-align: center; vertical-align: middle;">${저항}</td>
            <td style="text-align: center; vertical-align: middle;">${속도}</td>
            <td style="border-left: 2px solid darkgrey;">${strongHtml}</td> <!-- 강점 데이터를 추가 (속성을 기준으로 이미지 및 텍스트) -->
            <td style="border-right: 2px solid darkgrey;">${weakHtml}</td> <!-- 약점 데이터를 추가 (속성을 기준으로 이미지 및 텍스트) -->
            ${skillHtml(skill1, 1, name)} <!-- 1번째 스킬 -->
            ${skillHtml(skill2, 2, name)} <!-- 2번째 스킬 -->
            ${skillHtml(skill3, 3, name)} <!-- 3번째 스킬 -->
            <td style="border-left: 2px solid darkgrey;">${fieldsHtml}</td> <!-- 필드 이미지 표시 -->
        `;
        newRow.style.display = 'none'; // 모든 행을 초기에는 숨김 처리
        tableBody.appendChild(newRow);
    });
}

// 진화 단계 전체선택 기능 (체크박스 버전)
function toggleAllEvolution() {
    const evolutions = ['성장기', '성숙기', '완전체', '궁극체'];
    const checkBox = document.getElementById('select-all-evolution'); // 체크박스 ID 가져오기

    if (checkBox.checked) {
        // 체크박스가 선택된 경우, 모든 진화 단계를 활성화
        evolutions.forEach(evo => {
            if (!filters.evolution.includes(evo)) {
                filters.evolution.push(evo); // 선택되지 않은 진화 단계 추가
                document.getElementById(evo).classList.add('active'); // 버튼 활성화 스타일 추가
            }
        });
    } else {
        // 체크박스가 해제된 경우, 모든 진화 단계를 비활성화
        evolutions.forEach(evo => {
            filters.evolution = filters.evolution.filter(item => item !== evo); // 필터에서 제거
            document.getElementById(evo).classList.remove('active'); // 버튼 비활성화 스타일 제거
        });
    }
    filterTable(); // 테이블 필터링
}

function toggleEvolution(evolution) {
    const index = filters.evolution.indexOf(evolution);
    if (index > -1) {
        filters.evolution.splice(index, 1); // 필터 제거
        document.getElementById(evolution).classList.remove('active');
    } else {
        filters.evolution.push(evolution); // 필터 추가
        document.getElementById(evolution).classList.add('active');
    }
    filterTable();
}

function toggleAllType() {
    const types = ['백신', '데이터', '바이러스', '프리', '언노운'];
    const checkBox = document.getElementById('select-all-type'); // 체크박스 참조

    if (checkBox.checked) {
        // 체크박스가 선택되면 모두 활성화
        types.forEach(type => {
            if (!filters.type.includes(type)) {
                filters.type.push(type);
                document.getElementById(type).classList.add('active');
            }
        });
    } else {
        // 체크박스가 해제되면 모두 비활성화
        types.forEach(type => {
            filters.type = filters.type.filter(item => item !== type);
            document.getElementById(type).classList.remove('active');
        });
    }
    filterTable(); // 테이블 필터링
}


function toggleType(type) {
    const index = filters.type.indexOf(type);
    if (index > -1) {
        filters.type.splice(index, 1);
        document.getElementById(type).classList.remove('active');
    } else {
        filters.type.push(type);
        document.getElementById(type).classList.add('active');
    }
    filterTable();
}

function toggleAllSkill() {
    const skills = ['강철', '나무', '흙', '물', '물리', '바람', '불', '빛', '어둠', '얼음', '천둥'];
    const checkBox = document.getElementById('select-all-skill'); // 체크박스 참조

    if (checkBox.checked) {
        // 체크박스가 선택되면 모두 활성화
        skills.forEach(skill => {
            if (!filters.skill.includes(skill)) {
                filters.skill.push(skill);
                document.getElementById(skill).classList.add('active');
            }
        });
    } else {
        // 체크박스가 해제되면 모두 비활성화
        skills.forEach(skill => {
            filters.skill = filters.skill.filter(item => item !== skill);
            document.getElementById(skill).classList.remove('active');
        });
    }
    filterTable(); // 테이블 필터링
}


function toggleSkill(skill) {
    const index = filters.skill.indexOf(skill);
    if (index > -1) {
        filters.skill.splice(index, 1);
        document.getElementById(skill).classList.remove('active');
    } else {
        filters.skill.push(skill);
        document.getElementById(skill).classList.add('active');
    }
    filterTable();
}

function toggleAllStrong() {
    const strongs = ['강철', '나무', '흙', '물', '물리', '바람', '불', '빛', '어둠', '얼음', '천둥'];
    const checkBox = document.getElementById('select-all-strong'); // 체크박스 참조

    if (checkBox.checked) {
        // 체크박스가 선택되면 모두 활성화
        strongs.forEach(strong => {
            if (!filters.strong.includes(strong)) {
                filters.strong.push(strong);
                document.getElementById(`strong_${strong}`).classList.add('active');
            }
        });
    } else {
        // 체크박스가 해제되면 모두 비활성화
        strongs.forEach(strong => {
            filters.strong = filters.strong.filter(item => item !== strong);
            document.getElementById(`strong_${strong}`).classList.remove('active');
        });
    }
    filterTable(); // 테이블 필터링
}


function toggleSkillStrong(skillstrong) {
    const strength = skillstrong.replace('strong_', ''); 
    const index = filters.strong.indexOf(strength);  // 강점 배열에서 찾기
    
    if (index > -1) {
        filters.strong.splice(index, 1);  // 이미 있으면 배열에서 제거
        document.getElementById(skillstrong).classList.remove('active');  // 버튼에서 active 클래스 제거
    } else {
        filters.strong.push(strength);  // 없으면 배열에 추가
        document.getElementById(skillstrong).classList.add('active');  // 버튼에 active 클래스 추가
    }
    filterTable();  // 필터링 로직 호출
}

function toggleAllWeak() {
    const weaks = ['강철', '나무', '흙', '물', '물리', '바람', '불', '빛', '어둠', '얼음', '천둥'];
    const checkBox = document.getElementById('select-all-weak'); // 체크박스 참조

    if (checkBox.checked) {
        // 체크박스가 선택되면 모두 활성화
        weaks.forEach(weak => {
            if (!filters.weak.includes(weak)) {
                filters.weak.push(weak);
                document.getElementById(`weak_${weak}`).classList.add('active');
            }
        });
    } else {
        // 체크박스가 해제되면 모두 비활성화
        weaks.forEach(weak => {
            filters.weak = filters.weak.filter(item => item !== weak);
            document.getElementById(`weak_${weak}`).classList.remove('active');
        });
    }
    filterTable(); // 테이블 필터링
}



function toggleSkillWeak(skillweak) {
    const weakness = skillweak.replace('weak_', ''); 
    const index = filters.weak.indexOf(weakness);  // 강점 배열에서 찾기
    
    if (index > -1) {
        filters.weak.splice(index, 1);  // 이미 있으면 배열에서 제거
        document.getElementById(skillweak).classList.remove('active');  // 버튼에서 active 클래스 제거
    } else {
        filters.weak.push(weakness);  // 없으면 배열에 추가
        document.getElementById(skillweak).classList.add('active');  // 버튼에 active 클래스 추가
    }
    filterTable();  // 필터링 로직 호출
}

// 필드 전체선택 기능
function toggleAllField() {
    const fields = ['DA', 'UK', 'DR', 'DS', 'JT', 'ME', 'NSo', 'NSp', 'VB', 'WG'];
    const allSelected = fields.every(field => filters.field.includes(field));

    fields.forEach(field => {
        if (allSelected) {
            filters.field = [];
            document.getElementById(field).classList.remove('active');
        } else {
            if (!filters.field.includes(field)) {
                filters.field.push(field);
                document.getElementById(field).classList.add('active');
            }
        }
    });
    filterTable();
}

function toggleField(field) {
    const index = filters.field.indexOf(field);
    if (index > -1) {
        filters.field.splice(index, 1);
        document.getElementById(field).classList.remove('active');
    } else {
        filters.field.push(field);
        document.getElementById(field).classList.add('active');
    }
    filterTable();
}

// 필터 적용 함수
function filterTable() {
    const tableBody = document.getElementById('characterTable');
    const rows = tableBody.querySelectorAll('tr');

    // 필터가 비어있으면 모든 행을 숨김
    const hasFilter = Object.values(filters).some(filter => filter.length > 0); // 필터가 하나라도 있으면 true

    rows.forEach(row => {
        // 진화 단계와 타입 필터링
        const evolutionMatches = filters.evolution.length === 0 || filters.evolution.includes(row.dataset.evolution);
        const typeMatches = filters.type.length === 0 || filters.type.includes(row.dataset.type);

        // 필드 필터링: 선택된 모든 필터가 캐릭터의 필드에 포함되는지 확인
        const fields = [row.dataset.필드1, row.dataset.필드2, row.dataset.필드3];
        const fieldMatches = filters.field.length === 0 || filters.field.every(filterField => fields.includes(filterField));

        // 강점과 약점 필터 매칭 여부
        const strength = row.dataset.강점 ? row.dataset.강점.trim().toLowerCase() : '';
        const weakness = row.dataset.약점 ? row.dataset.약점.trim().toLowerCase() : '';
        const strengthsMatch = filters.strong.length === 0 || filters.strong.some(filter => filter.toLowerCase() === strength);
        const weaknessesMatch = filters.weak.length === 0 || filters.weak.some(filter => filter.toLowerCase() === weakness);

        // 스킬 속성 필터링
        const skill1Image = row.cells[13].querySelector('img');
        const skill1 = skill1Image ? skill1Image.alt : '';
        const skill2Image = row.cells[14].querySelector('img');
        const skill2 = skill2Image ? skill2Image.alt : '';
        const skill3Image = row.cells[15].querySelector('img');
        const skill3 = skill3Image ? skill3Image.alt : '';
        const skillsMatch = filters.skill.length === 0 || 
                            filters.skill.includes(skill1) ||
                            filters.skill.includes(skill2) ||
                            filters.skill.includes(skill3);

        // 필터 조건이 하나라도 맞으면 행을 표시, 아니면 숨김
        if (hasFilter && evolutionMatches && typeMatches && skillsMatch && fieldMatches && strengthsMatch && weaknessesMatch) {
            row.style.display = ''; // 조건을 만족하면 보이기
        } else {
            row.style.display = 'none'; // 조건을 만족하지 않으면 숨기기
        }
    });
}

// 테이블 초기화 시 필터가 없으면 숨김
window.onload = () => {
    fetchCSV();  // 데이터 로드 후
    filterTable();  // 필터를 적용해 초기 로드 시 테이블 비우기
};

function sortTable(column) {
    const table = document.getElementById('characterTable');
    const rows = Array.from(table.rows); // 테이블의 모든 행을 배열로 변환

    // 타입 정렬 순서 정의
    const typeOrder = ['백신', '데이터', '바이러스', '프리', '언노운'];

    rows.sort((a, b) => {
        let cellA = a.cells[column].innerText.trim();
        let cellB = b.cells[column].innerText.trim();

        if (column === 3) { // "타입" 열 (index 3)일 경우 이미지의 alt 속성을 기준으로 정렬
            cellA = a.cells[column].querySelector('img').alt.trim(); // A 셀의 이미지 alt 값
            cellB = b.cells[column].querySelector('img').alt.trim(); // B 셀의 이미지 alt 값

            // 타입의 순서에 따라 정렬
            const indexA = typeOrder.indexOf(cellA);
            const indexB = typeOrder.indexOf(cellB);

            // 없는 경우는 가장 마지막으로 배치
            const orderA = indexA === -1 ? typeOrder.length : indexA;
            const orderB = indexB === -1 ? typeOrder.length : indexB;

            return isAscending ? orderA - orderB : orderB - orderA;
        } else {
            // 나머지 열의 경우 숫자 또는 문자열로 정렬
            const aValue = isNaN(cellA) ? cellA : parseFloat(cellA);
            const bValue = isNaN(cellB) ? cellB : parseFloat(cellB);

            if (aValue < bValue) return isAscending ? -1 : 1;
            if (aValue > bValue) return isAscending ? 1 : -1;
            return 0;
        }
    });

    // 정렬된 행을 테이블에 다시 추가
    rows.forEach(row => table.appendChild(row));

    // 정렬 방향을 토글
    isAscending = !isAscending;

    // 정렬 상태 표시를 업데이트
    updateSortIndicator(column);
}




// 검색 기능 구현 (여러 검색어 지원)
document.getElementById('search').addEventListener('input', function() {
    const searchInput = this.value.toLowerCase().split(',').map(term => term.trim()); // 입력된 검색어를 소문자로 변환하고, 쉼표로 분리하여 배열로 만듦

    const rows = document.querySelectorAll('#characterTable tr'); // 테이블의 모든 행

    rows.forEach(row => {
        const name = row.dataset.name ? row.dataset.name.toLowerCase() : ''; // 디지몬 이름을 소문자로 변환

        // 필터가 적용되어있지 않고 검색창에 입력값이 없으면 테이블을 비우기
        const hasFilter = Object.values(filters).some(filter => filter.length > 0); // 필터가 하나라도 있으면 true

        if (!hasFilter && searchInput.length === 1 && searchInput[0] === '') {
            row.style.display = 'none'; // 필터가 없고 검색창이 비어있으면 모든 행을 숨김
        } else if (searchInput.length === 1 && searchInput[0] === '') {
            filterTable(); // 검색창이 비어있으면 필터를 다시 적용
        } else {
            // 여러 검색어 중 하나라도 이름과 일치하는지 확인
            const nameMatches = searchInput.some(term => name.includes(term));
            if (nameMatches) {
                row.style.display = ''; // 검색어가 일치하면 행을 표시
            } else {
                row.style.display = 'none'; // 조건을 만족하지 않으면 숨기기
            }
        }
    });
});



// 현재 열려 있는 툴팁을 추적하는 변수
let openTooltip = null;

// 툴팁 열기 함수
function showTooltip(tooltipId) {
  const tooltip = document.getElementById(tooltipId);
  if (openTooltip && openTooltip !== tooltip) {
    // 이미 다른 툴팁이 열려있으면 닫기
    openTooltip.classList.remove('show');
  }

  // 툴팁 열기
  tooltip.classList.add('show');
  openTooltip = tooltip; // 현재 열려 있는 툴팁으로 설정
}

// 툴팁 닫기 함수 정의 (오직 X 버튼에만 사용)
function hideTooltip(tooltipId) {
    const tooltip = document.getElementById(tooltipId);
    if (tooltip) {
      tooltip.classList.remove('show'); // 툴팁 숨기기
    }
  }
  
  // X 버튼으로 툴팁 닫기
  const closeBtns = document.querySelectorAll('.close-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
      event.stopPropagation(); // 이벤트 전파 차단, 버튼 클릭 시에만 이벤트 적용
      const tooltip = btn.closest('.tooltip-skill, .tooltip-field'); // 툴팁 찾기
      if (tooltip) {
        hideTooltip(tooltip.id); // 툴팁 닫기
      }
    });
  });
  
  // 툴팁 내부 클릭 시 툴팁이 닫히지 않도록 설정
  document.querySelectorAll('.tooltip-skill, .tooltip-field').forEach(tooltip => {
    tooltip.addEventListener('click', (event) => {
      event.stopPropagation(); // 툴팁 내부에서 클릭해도 툴팁이 닫히지 않도록 이벤트 차단
    });
  });

  // 필터 초기화 함수
function resetFilters() {
    // 필터를 모두 초기화
    filters.evolution = [];
    filters.type = [];
    filters.skill = [];
    filters.strong = [];
    filters.weak = [];
    filters.field = [];

    // 모든 버튼에서 활성화 상태를 제거
    const filterButtons = document.querySelectorAll('.button-group button, .button-group-field button');
    filterButtons.forEach(button => {
        button.classList.remove('active');
    });

    // 체크박스 상태도 초기화
    document.getElementById('select-all-evolution').checked = false;
    document.getElementById('select-all-type').checked = false;
    document.getElementById('select-all-skill').checked = false;
    document.getElementById('select-all-strong').checked = false;
    document.getElementById('select-all-weak').checked = false;

    // 테이블 필터링 갱신
    filterTable();
}





