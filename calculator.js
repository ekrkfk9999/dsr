// CSV 파일을 읽고 파싱하는 함수
async function fetchCSVData(fileName) {
    const response = await fetch(fileName);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));
    return rows;
}

// 스킬 선택 시 스킬 이미지 업데이트
document.getElementById('skill-select').addEventListener('change', function () {
    const characterName = document.getElementById('character-select').value;  // 현재 선택된 캐릭터 이름
    displaySkillImage(characterName);  // 스킬 이미지 업데이트
});

// 진화 단계 선택 시 캐릭터 목록 업데이트
document.getElementById('stage-select').addEventListener('change', async function () {
    const stage = this.value;  // 선택한 진화 단계 값
    const characters = await fetchCSVData('characters.csv');  // CSV 데이터 가져오기
    populateCharacterDropdown(characters, stage);  // 드롭다운 리스트 업데이트
});

// 캐릭터 선택 시 이미지, 타입, 레벨, 힘 정보 업데이트
document.getElementById('character-select').addEventListener('change', async function () {
    const characterName = this.value;  // 선택한 캐릭터 이름
    const characters = await fetchCSVData('characters.csv');  // CSV 데이터 가져오기
    displayCharacterType(characters, characterName);  // 타입 이미지 업데이트
    displayCharacterImage(characterName);  // 캐릭터 이미지 업데이트
    displayCharacterLevelAndPower(characters, characterName);  // 레벨 및 힘 정보 업데이트

    // 스킬 선택 및 스킬 레벨을 1스킬, 1레벨로 초기화
    const skillSelect = document.getElementById('skill-select');
    skillSelect.value = 'skill1';  // 1스킬로 설정
    skillSelect.dispatchEvent(new Event('change'));  // change 이벤트 강제 트리거

    const skillLevelSelect = document.getElementById('skilllevel-select');
    skillLevelSelect.value = '1레벨';  // 1레벨로 설정
    skillLevelSelect.dispatchEvent(new Event('change'));  // change 이벤트 강제 트리거

    // 선택된 캐릭터에 대한 스킬 이미지 업데이트
    displaySkillImage(characterName);
});
// 진화 단계에 따라 캐릭터 필터링 및 드롭다운 채우기
function populateCharacterDropdown(characters, stage) {
    const characterSelect = document.getElementById('character-select');
    characterSelect.innerHTML = ''; // 기존 옵션 초기화

    const filteredCharacters = characters.filter(character => character[1] === stage);

    filteredCharacters.forEach(character => {
        const option = document.createElement('option');
        option.value = character[0];
        option.textContent = character[0];
        characterSelect.appendChild(option);
    });

    // 기본적으로 첫 번째 캐릭터 선택
    if (filteredCharacters.length > 0) {
        const firstCharacter = filteredCharacters[0][0]; // 첫 번째 캐릭터
        characterSelect.value = firstCharacter;
        displayCharacterType(characters, firstCharacter); // 첫 번째 캐릭터의 타입 이미지 표시
        displayCharacterImage(firstCharacter); // 첫 번째 캐릭터 이미지 표시
        displayCharacterLevelAndPower(characters, firstCharacter); // 첫 번째 캐릭터의 레벨 및 힘 정보 표시
        displaySkillImage(firstCharacter); // 첫 번째 캐릭터의 스킬 이미지 표시
    }
}

// 선택된 캐릭터의 타입 정보를 가져와 이미지 표시
function displayCharacterType(characters, characterName) {
    const character = characters.find(character => character[0] === characterName);
    const type = character[2]; // 3번째 컬럼이 타입 정보

    // 이미지 경로를 설정
    const imagePath = `image/${type}.webp`;

    // 타입 이미지를 넣을 셀에 이미지 추가
    const typeImageCell = document.getElementById('type-image-cell');
    typeImageCell.innerHTML = `<img src="${imagePath}" alt="${type}" style="width: 25px; height: 25px;">`;
}

// 선택된 캐릭터의 이미지를 가져와 표시
function displayCharacterImage(characterName) {
    // 캐릭터 이름에 있는 ":"을 "_"로 대체
    const sanitizedCharacterName = characterName.replace(/:/g, '_');

    // 캐릭터 이미지 경로 설정
    const characterImagePath = `image/digimon/${sanitizedCharacterName}/${sanitizedCharacterName}.webp`;

    // 캐릭터 이미지를 넣을 셀에 이미지 추가
    const characterImageCell = document.getElementById('character-image-cell');
    characterImageCell.innerHTML = `<img src="${characterImagePath}" alt="${sanitizedCharacterName}" class="character-image">`;
}

// 선택된 캐릭터의 레벨과 힘 정보를 표시
function displayCharacterLevelAndPower(characters, characterName) {
    const character = characters.find(character => character[0] === characterName);
    const level = character[3]; // 4번째 컬럼이 레벨 정보
    const power = character[6]; // 7번째 컬럼이 힘 정보

    // 레벨과 힘을 넣을 셀에 숫자로 저장
    const levelCell = document.getElementById('level-cell');
    const powerCell = document.getElementById('힘-cell');

    // 숫자로 저장
    levelCell.textContent = level; // level은 숫자로 직접 저장
    powerCell.textContent = power; // power도 숫자로 직접 저장

}

// 선택된 캐릭터의 스킬 이미지를 표시
async function displaySkillImage(characterName) {
    const skillSelect = document.getElementById('skill-select').value;
    let skillFile = '';

    // 선택된 스킬에 따라 CSV 파일 선택
    if (skillSelect === 'skill1') {
        skillFile = 'skill1.csv';
    } else if (skillSelect === 'skill2') {
        skillFile = 'skill2.csv';
    } else if (skillSelect === 'skill3') {
        skillFile = 'skill3.csv';
    }

    // CSV 파일 불러오기
    const skillData = await fetchCSVData(skillFile);

    // CSV 파일에서 선택된 캐릭터의 이름(11번째 컬럼)과 비교하여 해당 스킬 찾기
    const skillRow = skillData.find(row => row[10] === characterName);

    if (skillRow) {
        const skillImageName = skillRow[15]; // 16번째 컬럼에서 이미지 이름 가져오기
        const skillImagePath = `image/${skillImageName}.webp`;

        // 스킬 이미지를 넣을 셀에 이미지 추가
        const skillImageCell = document.getElementById('skill-cell');
        skillImageCell.innerHTML = `<img src="${skillImagePath}" alt="${skillImageName}" style="width: 25px; height: 25px; background-image: url('image/background.webp'); background-size: 120%; background-position: center;">`;
    } else {
        console.log('일치하는 스킬을 찾을 수 없습니다.');
    }
}

// map1-select 변경 시 map2-select 업데이트
document.getElementById('map1-select').addEventListener('change', async function() {
    const selectedRegion = this.value;
    const mobData = await fetchCSVData('mob.csv');
    
    // 첫 번째 컬럼에서 map1-select와 일치하는 행을 찾아서 중복 없이 두 번째 컬럼 값을 가져오기
    const filteredLocations = [...new Set(mobData.filter(row => row[0] === selectedRegion).map(row => row[1]))];

    const map2Select = document.getElementById('map2-select');
    map2Select.innerHTML = ''; // 기존 옵션 초기화

    // 필터링된 데이터를 기반으로 옵션 추가
    filteredLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        map2Select.appendChild(option);
    });

    // 기본적으로 첫 번째 위치 선택
    if (filteredLocations.length > 0) {
        map2Select.value = filteredLocations[0];
        updateMobSelect(mobData, filteredLocations[0]); // map2-select 변경에 따른 mob-select 업데이트
    }
});

// map2-select 변경 시 mob-select 업데이트
document.getElementById('map2-select').addEventListener('change', async function() {
    const selectedLocation = this.value;
    const mobData = await fetchCSVData('mob.csv');
    updateMobSelect(mobData, selectedLocation); // map2-select 변경에 따른 mob-select 업데이트
});

// mob-select를 업데이트하는 함수
function updateMobSelect(mobData, selectedLocation) {
    const filteredMobs = [...new Set(mobData.filter(row => row[1] === selectedLocation).map(row => row[2]))];

    const mobSelect = document.getElementById('mob-select');
    mobSelect.innerHTML = ''; // 기존 옵션 초기화

    // 필터링된 데이터를 기반으로 mob-select 옵션 추가
    filteredMobs.forEach(mob => {
        const option = document.createElement('option');
        option.value = mob;
        option.textContent = mob;
        mobSelect.appendChild(option);
    });

    // 기본적으로 첫 번째 mob 선택
    if (filteredMobs.length > 0) {
        mobSelect.value = filteredMobs[0];
        updateMobDetails(mobData, filteredMobs[0]); // 첫 번째 mob에 대한 상세 정보 표시

        // 첫 번째 몹에 대해 change 이벤트를 수동으로 트리거하여 정보 갱신
        mobSelect.dispatchEvent(new Event('change'));
    }
}

// mob-select 변경 시 해당 몹의 상세 정보 업데이트
document.getElementById('mob-select').addEventListener('change', async function() {
    const selectedMob = this.value;
    const mobData = await fetchCSVData('mob.csv');
    updateMobDetails(mobData, selectedMob); // mob-select 변경에 따른 상세 정보 업데이트
});

// mob의 상세 정보를 업데이트하는 함수
function updateMobDetails(mobData, selectedMob) {
    const selectedMap = document.getElementById('map2-select').value;  // 선택된 맵

    // mob 이름과 맵 이름을 동시에 체크해서 행을 찾음
    const mobRow = mobData.find(row => row[2] === selectedMob && row[1] === selectedMap);  // 3번째 컬럼은 이름, 2번째 컬럼은 맵

    if (mobRow) {
        // 각 요소에 해당하는 값을 삽입
        document.getElementById('mob-level').textContent = mobRow[3];  // 4번째 컬럼 - 레벨

        // 타입 이미지
        if (mobRow[4]) {
            const mobTypeImage = `image/${mobRow[4]}.webp`;  // 5번째 컬럼 - 타입
            document.getElementById('mob-type').innerHTML = `<img src="${mobTypeImage}" alt="${mobRow[4]}" style="width: 25px; height: 25px;">`;
        } else {
            document.getElementById('mob-type').textContent = '-';  // 타입이 없을 경우
        }

        // HP 표시
        document.getElementById('mob-hp').textContent = mobRow[5];  // 6번째 컬럼 - HP

        // 방어력 표시
        const defenseValue = parseFloat(mobRow[6]).toFixed(2);  
        document.getElementById('mob-def').textContent = defenseValue;  // 7번째 컬럼 - 방어력

        // 약점 이미지 또는 '-' 표시
        if (mobRow[7]) {
            const mobWeaknessImage = `image/${mobRow[7]}.webp`;  // 8번째 컬럼 - 약점
            document.getElementById('mob-weak').innerHTML = `<img src="${mobWeaknessImage}" alt="${mobRow[7]}" style="width: 25px; height: 25px; background-image: url('image/weakbackground.webp'); background-size: 120%; background-position: center;">`;
        } else {
            document.getElementById('mob-weak').textContent = '-';  // 약점이 없을 경우
        }

        // 강점 이미지 또는 '-' 표시
        if (mobRow[8]) {
            const mobStrengthImage = `image/${mobRow[8]}.webp`;  // 9번째 컬럼 - 강점
            document.getElementById('mob-strong').innerHTML = `<img src="${mobStrengthImage}" alt="${mobRow[8]}" style="width: 25px; height: 25px; background-image: url('image/strongbackground.webp'); background-size: 120%; background-position: center;">`;
        } else {
            document.getElementById('mob-strong').textContent = '-';  // 강점이 없을 경우
        }

        // 선택된 mob 이름을 기반으로 이미지 경로를 설정하고 id="mob-image-cell"에 이미지를 추가
        const mobImagePath = `image/digimon/${selectedMob}/${selectedMob}.webp`;
        const mobImageCell = document.getElementById('mob-image-cell');
        mobImageCell.innerHTML = `<img src="${mobImagePath}" alt="${selectedMob}" class="mob-image">`;

    } else {
        console.log('일치하는 몹을 찾을 수 없습니다.');
    }
}


// 페이지 로드 시 기본으로 'map1-select', 'map2-select', 'mob-select'의 첫 번째 값을 표시
window.addEventListener('DOMContentLoaded', async function() {
    // 'map1-select'의 첫 번째 값을 가져와서 해당하는 'map2-select'를 업데이트
    const map1Select = document.getElementById('map1-select');
    const defaultRegion = map1Select.value; // 기본적으로 선택된 값 (첫 번째 값)

    const mobData = await fetchCSVData('mob.csv');

    // 'map1-select'의 첫 번째 값에 따라 'map2-select'를 채움
    const filteredLocations = [...new Set(mobData.filter(row => row[0] === defaultRegion).map(row => row[1]))];

    const map2Select = document.getElementById('map2-select');
    map2Select.innerHTML = ''; // 기존 옵션 초기화

    filteredLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        map2Select.appendChild(option);
    });

    // 기본적으로 첫 번째 위치 선택
    if (filteredLocations.length > 0) {
        map2Select.value = filteredLocations[0];
        updateMobSelect(mobData, filteredLocations[0]); // map2-select의 첫 번째 값에 따른 mob-select 업데이트
    }

    // 기본 진화 단계: '완전체', 첫 번째 캐릭터
    const characters = await fetchCSVData('characters.csv');
    populateCharacterDropdown(characters, '완전체');

    // 기본 스킬 설정: '1스킬'
    const skillSelect = document.getElementById('skill-select');
    skillSelect.value = 'skill1'; // 첫 번째 값 선택

    const skillLevelSelect = document.getElementById('skilllevel-select');
    skillLevelSelect.value = '1레벨'; // 첫 번째 레벨 선택

    // 첫 번째 값에 대해 change 이벤트 강제 트리거
    skillSelect.dispatchEvent(new Event('change'));
    skillLevelSelect.dispatchEvent(new Event('change'));

    // 첫 번째 캐릭터에 대한 스킬 이미지 표시
    const firstCharacter = characters.find(character => character[1] === '완전체')[0];
    displaySkillImage(firstCharacter);
});

// CSV 파일을 읽고 파싱하는 함수
async function fetchCSVData(fileName) {
    const response = await fetch(fileName);
    const data = await response.text();
    const rows = data.split('\n').map(row => row.split(','));
    return rows;
}

// Function to calculate and update the total strength result
async function calculateStrengthResult() {
    // Helper function to get the value of an input, default to 0 if empty
    function getInputValue(id) {
        const value = document.getElementById(id).value;
        return value ? parseFloat(value) : 0; // Parse the value to a number or default to 0
    }

    // Fetching characters data from characters.csv
    const characterName = document.getElementById('character-select').value;  // 선택된 캐릭터 이름
    const charactersData = await fetchCSVData('characters.csv');  // characters.csv 파일 데이터 가져오기
    const characterRow = charactersData.find(row => row[0] === characterName);  // 캐릭터 이름으로 행 찾기

    if (characterRow) {
        basePower = parseFloat(characterRow[6]) || 0;  // 7번째 컬럼에서 기본 힘을 가져오기
    } else {
        console.error('일치하는 캐릭터를 찾을 수 없습니다.');
    }

    // Fetching potential, correction, synergy, buff, specialization, equipment values
    const potential = getInputValue('potential') / 100;  // Convert percentage to decimal
    const correction = getInputValue('correction') / 100;  // Convert percentage to decimal
    const synergy = getInputValue('synergy') / 100;  // Convert percentage to decimal
    const buff = getInputValue('buff');
    const specialization = getInputValue('specialization');
    const equipment = getInputValue('equipment');

    // Performing the calculation
    const totalStrength = basePower
        + Math.ceil(basePower * potential)
        + Math.ceil(basePower * correction)
        + Math.ceil(basePower * synergy)
        + buff
        + specialization
        + equipment;

    // Display the result in the "str-result" element
    document.getElementById('str-result').textContent = totalStrength;

    return totalStrength; // Return the totalStrength to use it in minDamage calculation
}

// Event listener to calculate strength whenever inputs change
document.querySelectorAll('#potential, #correction, #synergy, #buff, #specialization, #equipment')
    .forEach(input => input.addEventListener('input', calculateStrengthResult));

// Call the function to calculate strength on page load
window.addEventListener('DOMContentLoaded', calculateStrengthResult);



// 필요한 힘 계산을 위한 함수
async function calculateNeedStr() {
    // 1. 악역 디지몬의 정보 가져오기 (mob.csv 파일에서)
    const mobName = document.getElementById('mob-select').value;  // 선택된 악역 디지몬 이름
    const selectedMap = document.getElementById('map2-select').value;  // 선택된 맵

    let mobHP = 0;  // 체력
    let mobDef = 0;  // 수비
    let mobType = '';  // 악역 디지몬 타입
    let mobStrong = '';  // 악역 디지몬 강점
    let mobWeak = '';  // 악역 디지몬 약점

    const mobData = await fetchCSVData('mob.csv');  // mob.csv 파일 데이터 가져오기
    const mobRow = mobData.find(row => row[2] === mobName && row[1] === selectedMap);  // 3번째 컬럼에서 몹 이름, 2번째 컬럼에서 맵 이름 확인

    if (mobRow) {
        mobHP = parseFloat(mobRow[5]);  // 6번째 컬럼에서 체력 가져오기
        mobDef = parseFloat(mobRow[6]);  // 7번째 컬럼에서 수비 가져오기
        mobType = mobRow[4];  // 5번째 컬럼에서 악역 디지몬 타입 가져오기
        mobStrong = mobRow[8];  // 9번째 컬럼에서 악역 디지몬 강점 가져오기
        mobWeak = mobRow[7];  // 8번째 컬럼에서 악역 디지몬 약점 가져오기
    } else {
        console.error('일치하는 몹을 찾을 수 없습니다.');
        document.getElementById('needstr').textContent = "계산 불가";
        return;
    }

    // 2. 내 디지몬 타입 및 레벨 가져오기 (characters.csv 파일에서)
    const characterName = document.getElementById('character-select').value;  // 선택된 캐릭터 이름
    let myType = '';  // 내 디지몬 타입을 저장할 변수
    let myLevel = 1;  // 기본 레벨 값 (만약 값을 찾을 수 없을 경우)
    const characterData = await fetchCSVData('characters.csv');  // characters.csv 파일 데이터 가져오기
    const characterRow = characterData.find(row => row[0] === characterName);  // 1번째 컬럼에서 내 디지몬 이름 확인

    if (characterRow) {
        myType = characterRow[2];  // 3번째 컬럼에서 내 디지몬 타입 가져오기
        myLevel = parseInt(characterRow[3], 10);  // 4번째 컬럼에서 레벨 가져오기
    } else {
        console.error('일치하는 캐릭터를 찾을 수 없습니다.');
        document.getElementById('needstr').textContent = "계산 불가";
        return;
    }
    // 3. 스킬 선택에 따른 스킬 계수와 타수 가져오기 (내 디지몬의 스킬 선택과 레벨에 따른 CSV 파일에서 데이터 추출)
    const skillSelect = document.getElementById('skill-select').value;  // 스킬 선택
    const skillLevel = document.getElementById('skilllevel-select').value;  // 스킬 레벨 (1레벨, 2레벨, ...)
    let skillCoefficient = 0;  // 스킬 계수를 저장할 변수
    let hitCount = 1;  // 타수를 저장할 변수
    let mySkillElement = '';  // 스킬 속성 값을 저장할 변수

    const skillData = await fetchCSVData(`${skillSelect}.csv`);  // 예: skill1.csv, skill2.csv, skill3.csv
    const skillRow = skillData.find(row => row[10] === characterName);  // 11번째 컬럼에서 캐릭터 이름 일치 확인

    if (skillRow) {
        const levelIndex = parseInt(skillLevel) - 1;  // 스킬 레벨에 따른 컬럼 인덱스 (0-based)
        skillCoefficient = parseFloat(skillRow[levelIndex]);  // 스킬 계수 가져오기
        hitCount = parseFloat(skillRow[13]);  // 14번째 컬럼에서 타수 가져오기
        mySkillElement = skillRow[15];  // 16번째 컬럼에서 스킬 속성 가져오기
    }

    // 4. skillcount 값을 가져오기 (1킬, 2킬, 3킬)
    const skillCount = document.getElementById('skillcount').value;

    // skillcount에 따라 체력 조정
    if (skillCount === "2킬") {
        mobHP = mobHP / 2;  // 체력을 1/2로 나눔
    } else if (skillCount === "3킬") {
        mobHP = mobHP / 3;  // 체력을 1/3로 나눔
    }

    // 5. 상성 계산 (타입 상성 로직)
    let compatibility = 1.0;  // 기본값

    // 타입 상성 계산 (백신, 바이러스, 데이터, 프리, 언노운)
    if (myType === "백신" && mobType === "바이러스") compatibility = 1.25;
    else if (myType === "바이러스" && mobType === "데이터") compatibility = 1.25;
    else if (myType === "데이터" && mobType === "백신") compatibility = 1.25;
    else if (myType === "프리" && ["백신", "데이터", "바이러스"].includes(mobType)) compatibility = 1.0;
    else if (myType === "프리" && mobType === "언노운") compatibility = 1.25;
    else if (myType === "언노운" && ["백신", "데이터", "바이러스"].includes(mobType)) compatibility = 1.125;
    else if (myType === "언노운" && mobType === "프리") compatibility = 0.75;
    else if (myType === mobType) compatibility = 1.0;  // 동일 타입

    let elementalFactor = 1.0;  // 기본값

    if (mySkillElement === mobStrong) elementalFactor = 0.75;  // 강점과 같으면 0.75
    else if (mySkillElement === mobWeak) elementalFactor = 1.25;  // 약점과 같으면 1.25

    // 7. 최소 데미지 배율과 상수
    const minDamageRatio = 0.95;
    const constant = myLevel * 12 + 24;

    // 8. totalStrength 값을 가져와서 필요 힘 계산에 사용
    const totalStrength = await calculateStrengthResult();

    // 8. 필요 힘 계산
    const needStr = Math.ceil(mobHP / (hitCount * skillCoefficient * compatibility * elementalFactor * constant * minDamageRatio / mobDef));



    // **데미지 계산** 추가: str-result, 타수, 스킬 계수, 상성, 강약점, 1224를 사용해 데미지 계산
    const strResult = parseFloat(document.getElementById('str-result').textContent) || 0;  // str-result 값 가져오기
    const minDamage = Math.ceil(totalStrength * hitCount * skillCoefficient * compatibility * elementalFactor * constant * minDamageRatio / mobDef);

    // 9. 계산된 값 "needstr"에 표시
    document.getElementById('needstr').textContent = needStr;

    // 계산된 데미지 값을 "min-damage"에 표시
    document.getElementById('min-damage').textContent = minDamage;
}
// Event listeners for skill selection and other input changes
document.querySelectorAll('#potential, #correction, #synergy, #buff, #specialization, #equipment')
    .forEach(input => input.addEventListener('input', async () => {
        await calculateStrengthResult();  // Strength result recalculated
        await calculateNeedStr();  // NeedStr and minDamage recalculated
    }));

// 스킬 선택 및 레벨, skillcount 변경 시마다 필요 힘과 데미지를 계산
document.getElementById('skill-select').addEventListener('change', calculateNeedStr);
document.getElementById('skilllevel-select').addEventListener('change', calculateNeedStr);
document.getElementById('skillcount').addEventListener('change', calculateNeedStr);
document.getElementById('mob-select').addEventListener('change', calculateNeedStr);  // 악역 디지몬 선택 시 필요 힘 및 데미지 계산
document.getElementById('map2-select').addEventListener('change', calculateNeedStr);  // 맵 변경 시 필요 힘 및 데미지 계산

// On page load, trigger calculation
window.addEventListener('DOMContentLoaded', async () => {
    await calculateStrengthResult();
    await calculateNeedStr();
});


