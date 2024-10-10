let allData = [];
let conditionData = [];
let jogressData = [];
let charactersData = [];

// characters.csv를 불러와서 타입 데이터를 저장하는 함수
async function loadCharactersCSV() {
    const response = await fetch('characters.csv'); // characters.csv 파일 경로
    const data = await response.text();
    charactersData = parseCSV(data); // 데이터를 파싱하여 charactersData에 저장
}

// jogress.csv 파일을 불러와서 처리
async function loadJogressCSV() {
    const response = await fetch('jogress.csv'); // jogress.csv 파일 경로
    const data = await response.text();
    jogressData = parseCSV(data); // 데이터를 파싱하여 jogressData에 저장
}

// CSV 파일에서 데이터를 불러와서 처리
async function loadCSV() {
    const response = await fetch('evolution.csv'); // CSV 파일 경로
    const data = await response.text();
    allData = parseCSV(data);

    // 디지몬 이미지 목록 생성
    createDigimonImageList(allData);
}

// condition.csv를 불러와서 저장
async function loadConditionCSV() {
    const response = await fetch('condition.csv'); // condition.csv 파일 경로
    const data = await response.text();
    conditionData = parseCSV(data);
}

// CSV 데이터를 파싱하는 함수
function parseCSV(csv) {
    const lines = csv.split('\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j] ? currentLine[j].trim() : null;
        }

        result.push(obj);
    }
    return result;
}

// 특정 진화단계를 필터링하는 함수
function filterDigimonByStage(stage) {
    let filteredData;

    if (stage === 'all') {
        // 전체 버튼 클릭 시 모든 디지몬 표시
        filteredData = allData;
    } else {
        // 특정 진화 단계에 따라 필터링
        filteredData = allData.filter(digimon => digimon.evolution_stage == stage);
    }

    createDigimonImageList(filteredData);
}

let selectedDigimon = null;

// 디지몬 이미지 목록을 생성하는 함수
function createDigimonImageList(data) {
    const imageListContainer = document.getElementById('digimon-image-list');
    imageListContainer.innerHTML = ''; // 기존 목록 초기화

    data.forEach(digimon => {
        const digimonName = digimon.name.replace(':', '_'); // ':'를 '_'로 변환

        const imgContainer = document.createElement('div');
        imgContainer.classList.add('digimon-image-container');

        const img = document.createElement('img');
        img.src = `image/digimon/${digimonName}/${digimonName}.webp`;
        img.alt = digimon.name;
        img.width = 100;
        img.height = 100;

        // 이미지에 마우스를 올리면 이름 툴팁을 보여줌
        img.addEventListener('mouseover', (event) => {
            showNameTooltip(event, digimon.name);
        });

        // 마우스가 이미지에서 벗어나면 툴팁 숨기기
        img.addEventListener('mouseout', hideNameTooltip);

        // 이미지 클릭 시 선택 및 진화트리 표시를 동시에 처리
        img.addEventListener('click', () => {
            // 이전에 선택된 디지몬의 선택 해제
            if (selectedDigimon) {
                selectedDigimon.classList.remove('selected');
            }

            // 현재 선택된 디지몬에 'selected' 클래스 추가
            imgContainer.classList.add('selected');
            selectedDigimon = imgContainer; // 현재 선택된 디지몬을 저장

            // 선택된 디지몬의 진화트리를 표시
            showEvolutionTreeForDigimon(digimon.name);
        });

        imgContainer.appendChild(img);  // 이미지 추가
        imageListContainer.appendChild(imgContainer); // 이미지 컨테이너를 리스트에 추가
    });
}

function showNameTooltip(event, digimonName) {
    const nameTooltip = document.getElementById('name-tooltip');
    nameTooltip.textContent = digimonName;

    // 툴팁의 위치를 이미지의 좌하단에 맞춰 설정
    const imgRect = event.target.getBoundingClientRect();
    nameTooltip.style.left = `${imgRect.left}px`;
    nameTooltip.style.top = `${imgRect.bottom + window.scrollY - 185}px`;  // 이미지 아래에 표시 (10px 간격)

    nameTooltip.classList.add('visible-tooltip');
}

function hideNameTooltip() {
    const nameTooltip = document.getElementById('name-tooltip');
    nameTooltip.classList.remove('visible-tooltip');
}

function showEvolutionTooltip(event, digimonName) {
    const evolutionTooltip = document.getElementById('evolution-tooltip');
    evolutionTooltip.textContent = digimonName;

    // 이미지의 현재 위치를 기준으로 툴팁 위치 설정 (이미지의 좌하단에 붙도록)
    const imgRect = event.target.getBoundingClientRect();
    evolutionTooltip.style.left = `${imgRect.left + window.scrollX - 2}px`; 
    evolutionTooltip.style.top = `${imgRect.bottom + window.scrollY - 180}px`;  // 이미지 아래에 표시 (10px 간격)

    evolutionTooltip.classList.add('visible-tooltip');
}

function hideEvolutionTooltip() {
    const evolutionTooltip = document.getElementById('evolution-tooltip');
    evolutionTooltip.classList.remove('visible-tooltip');
}

let selectedDigimonName = null; // 선택된 디지몬 이름을 저장하는 변수

function showEvolutionTreeForDigimon(digimonName) {
    selectedDigimonName = digimonName; // 선택된 디지몬의 이름 저장

    // 선택된 디지몬의 하위 진화체를 찾음
    const lowerEvolutions = findAllLowerEvolutions(digimonName);
    const filteredData = filterTreeByDigimonName(digimonName);
    if (filteredData.length > 0) {
        createEvolutionTree(filteredData, lowerEvolutions);
    } else {
        alert('해당 디지몬의 진화트리를 찾을 수 없습니다.');
    }
}

// 선택된 디지몬의 모든 하위 진화체를 찾는 재귀 함수
function findAllLowerEvolutions(digimonName) {
    const lowerEvolutions = [];

    // 현재 선택된 디지몬을 하위 진화체 리스트에 포함
    lowerEvolutions.push(digimonName);

    // 현재 디지몬을 상위 진화체로 가지는 디지몬들을 찾음
    const directLowerEvolutions = allData.filter(digimon => {
        return [digimon.evol1, digimon.evol2, digimon.evol3,
                digimon.evol4, digimon.evol5, digimon.evol6,
                digimon.evol7, digimon.evol8, digimon.evol9,
                digimon.evol10, digimon.evol11, digimon.조그레스].includes(digimonName);
    });

    // 찾은 하위 진화체들에 대해 다시 하위 진화체를 재귀적으로 찾음
    directLowerEvolutions.forEach(digimon => {
        lowerEvolutions.push(...findAllLowerEvolutions(digimon.name));
    });

    return lowerEvolutions;
}

// 디지몬 이름을 기반으로 해당 디지몬이 포함된 트리에서 진화단계를 필터링하는 함수
function filterTreeByDigimonName(digimonName) {
    // 선택된 디지몬 정보 가져오기
    const selectedDigimon = allData.find(digimon => digimon.name === digimonName);

    if (!selectedDigimon) {
        return []; // 선택된 디지몬이 없으면 빈 배열 반환
    }

    // 선택된 디지몬의 진화 단계 확인
    const selectedEvolutionStage = parseInt(selectedDigimon.evolution_stage, 10);

    let evolutionStageToFilter;
    if (selectedEvolutionStage == 1 ) {
        evolutionStageToFilter = '1';
    }
    else if (selectedEvolutionStage >= 2 && selectedEvolutionStage <= 3) {
        evolutionStageToFilter = '2';
    }
    else if (selectedEvolutionStage >= 4 && selectedEvolutionStage <= 6) {
        evolutionStageToFilter = '3';
    }

    // 선택한 진화 단계로 필터링
    const filteredDigimons = allData.filter(digimon => digimon.evolution_stage === evolutionStageToFilter);

    // 해당 진화 단계에서 클릭된 디지몬이 포함된 트리 찾기
    const treeWithSearchedDigimon = filteredDigimons.filter(digimon => isDigimonInTree(digimon, digimonName));
    return treeWithSearchedDigimon;
}


// 재귀적으로 진화체를 검색하여 해당 디지몬이 트리에 포함되는지 확인하는 함수
function isDigimonInTree(digimon, searchName) {
    if (digimon.name === searchName) {
        return true;
    }

    const evolutions = [
        digimon.evol1, digimon.evol2, digimon.evol3, digimon.evol4, digimon.evol5, digimon.evol6,
        digimon.evol7, digimon.evol8, digimon.evol9, digimon.evol10, digimon.evol11, digimon.조그레스
    ].filter(e => e);  // 존재하는 진화체만 필터링
    for (const evolution of evolutions) {
        const nextDigimon = allData.find(d => d.name === evolution);
        if (nextDigimon && isDigimonInTree(nextDigimon, searchName)) {
            return true;
        }
    }

    return false;
}

// 선택된 디지몬을 제외한 하이라이트된 자식 노드들만 확장하는 함수
function activateHighlightedChildPlusButtons(parentNode) {
    // 현재 노드에서 바로 이어지는 하이라이트된 자식 노드들만 찾음
    const highlightedChildNodes = parentNode.querySelectorAll('.children-container .digimon.highlighted');

    highlightedChildNodes.forEach(node => {
        // 디지몬 이름 추출 (':'를 '_'로 변환된 상태를 복구하여 원래 이름과 비교)
        const digimonImage = Array.from(node.querySelectorAll('img')).find(img => !img.classList.contains('type-image'));
        const digimonName = digimonImage ? digimonImage.alt : '';  // 디지몬 이름 추출
    
        // 선택된 디지몬의 이름과 일치하는 노드는 확장에서 제외
        if (digimonName !== selectedDigimonName) {
            const plusBtn = node.querySelector('.plus-btn');
            if (plusBtn) {
                // 이미 열려 있지 않은 경우에만 클릭
                if (plusBtn.textContent === '+') {
                    plusBtn.click(); // 자식 + 버튼 클릭하여 확장
                }
            }
        }
    });
}

function createDigimonNode(digimon, data, lowerEvolutions) {
    const container = document.createElement('div');
    container.classList.add('digimon-container');

    const digimonDiv = document.createElement('div');
    digimonDiv.classList.add('digimon');

    const digimonName = digimon.name.replace(':', '_');

    const img = document.createElement('img');
    img.src = `image/digimon/${digimonName}/${digimonName}.webp`; 
    img.alt = digimon.name;

    // 디지몬 타입을 가져와서 타입 이미지 추가
    const characterInfo = charactersData.find(character => character.name === digimon.name);
    if (characterInfo && characterInfo.type) {
        const typeImg = document.createElement('img');
        typeImg.src = `image/${characterInfo.type}.webp`; // 타입 이미지 경로
        typeImg.alt = characterInfo.type;
        typeImg.classList.add('type-image'); // 타입 이미지에 대한 스타일 적용

        digimonDiv.appendChild(typeImg); // 타입 이미지를 디지몬 이미지 위에 추가
    }

    img.addEventListener('mouseover', (event) => showEvolutionTooltip(event, digimon.name));
    img.addEventListener('mouseout', hideEvolutionTooltip);
    img.addEventListener('mouseover', (event) => showTooltip(event, digimon.name));  
    img.addEventListener('mouseout', hideTooltip);  

    if (lowerEvolutions.includes(digimon.name)) {
        digimonDiv.classList.add('highlighted'); 
    }

    const horizontalLine = document.createElement('div');
    horizontalLine.classList.add('horizontal-line');

    const verticalLine = document.createElement('div');
    verticalLine.classList.add('vertical-line');

    const childrenContainer = document.createElement('div');
    childrenContainer.classList.add('children-container');

    const evolutions = [
        { name: digimon.evol1, percent: digimon.percent1 },
        { name: digimon.evol2, percent: digimon.percent2 },
        { name: digimon.evol3, percent: digimon.percent3 },
        { name: digimon.evol4, percent: digimon.percent4 },
        { name: digimon.evol5, percent: digimon.percent5 },
        { name: digimon.evol6, percent: digimon.percent6 },
        { name: digimon.evol7, percent: digimon.percent7 },
        { name: digimon.evol8, percent: digimon.percent8 },
        { name: digimon.evol9, percent: digimon.percent9 },
        { name: digimon.evol10, percent: digimon.percent10 },
        { name: digimon.evol11, percent: digimon.percent11 },
        { name: digimon.조그레스, percent: digimon.percent }
    ].filter(e => e.name);

    const hasEvolution = evolutions.length > 0;

    if (hasEvolution) {
        const plusBtn = document.createElement('button');
        plusBtn.classList.add('plus-btn');
        plusBtn.textContent = '+'; 

        plusBtn.addEventListener('click', () => {
            if (!childrenContainer.children.length) {
                evolutions.forEach(evolution => {
                    const nextDigimon = data.find(d => d.name === evolution.name);
                    if (nextDigimon) {
                        const nextNode = createDigimonNode(nextDigimon, data, lowerEvolutions);

                        const percentageText = document.createElement('span');
                        percentageText.classList.add('percentage-text');
                        percentageText.textContent = `${evolution.percent}%`;

                        let horizontalConnector = nextNode.querySelector('.horizontal-connector');
                        if (!horizontalConnector) {
                            horizontalConnector = document.createElement('div');
                            horizontalConnector.classList.add('horizontal-connector');
                            nextNode.appendChild(horizontalConnector);
                        }
                        horizontalConnector.style.display = 'block';
                        horizontalConnector.appendChild(percentageText);

                        if (evolution.name === digimon.조그레스) {
                            const jogressImageName = digimon[Object.keys(digimon)[26]];  // 유지
                            const jogressImagePath = `image/digimon/${jogressImageName}/${jogressImageName}.webp`;
                        
                            const jogressImage = document.createElement('img');
                            jogressImage.src = jogressImagePath; 
                            jogressImage.classList.add('jogress-image'); 
                            
                            // 마우스 오버 시 툴팁 표시
                            jogressImage.addEventListener('mouseover', (event) => {
                                const evolution23rdValue = digimon[Object.keys(digimon)[24]];  // evolution.csv의 23번째 컬럼 값
                                const jogressDataEntry = jogressData.find(jogress => jogress.name === evolution23rdValue);  // jogress.csv에서 해당 값 찾기
                                showJogressTooltip(jogressImage, jogressDataEntry);  // 조그레스 툴팁 표시, jogress.csv에서 찾은 데이터를 사용
                            });
                            
                            // 마우스가 벗어났을 때 툴팁 숨기기
                            jogressImage.addEventListener('mouseout', hideJogressTooltip);
                        
                            horizontalConnector.appendChild(jogressImage);
                        }
                        

                        childrenContainer.appendChild(nextNode);
                    }
                });
            }

            childrenContainer.classList.toggle('visible');

            updateAllVerticalLinesAndHorizontalConnectors();

            if (childrenContainer.classList.contains('visible')) {
                plusBtn.textContent = '−'; 
                horizontalLine.style.display = 'block'; 
                verticalLine.style.display = 'block';   

                activateHighlightedChildPlusButtons(container);
            } else {
                plusBtn.textContent = '+';
                horizontalLine.style.display = 'none'; 
                verticalLine.style.display = 'none';  
                verticalLine.style.height = '0';     
                verticalLine.style.top = '0';      
            }

        });

        digimonDiv.appendChild(plusBtn);
    }

    digimonDiv.appendChild(img); 
    container.appendChild(digimonDiv);
    container.appendChild(horizontalLine);
    container.appendChild(verticalLine);
    container.appendChild(childrenContainer);

    return container;
}

// 툴팁에 테이블을 표시하는 함수
function showJogressTooltip(jogressImage, jogressDataEntry) {
    const tooltip = document.getElementById('tooltip');

    if (!jogressDataEntry) {
        tooltip.textContent = '조그레스 데이터 없음';  // 해당 디지몬의 조그레스 데이터가 없을 경우 표시
    } else {
        // 테이블 생성 (빈값 제외)
        let tableHtml = `<table class="jogress-tooltip-table">`;

        // 최상단 행 (진화조건 제목)
        tableHtml += `
            <tr>
                <th colspan="3">조그레스 진화 조건</th>
            </tr>
        `;

        // 첫 번째 행 (디지몬)
        if (jogressDataEntry.digimon1 || jogressDataEntry.digimon2) {
            tableHtml += `
                <tr>
                    <th>디지몬</th>
                    <th>${jogressDataEntry.digimon1 || ''}</th>
                    <th>${jogressDataEntry.digimon2 || ''}</th>
                </tr>`;
        }

        // 나머지 행들 (레벨, 유대감, 힘, 지능, 수비, 저항, 속도)
        const rows = [
            { label: '레벨', key1: 'level1', key2: 'level2' },
            { label: '유대감', key1: 'bond1', key2: 'bond2', suffix: '%' },  // 유대감은 %를 붙임
            { label: '힘', key1: 'str1', key2: 'str2', percentKey1: 'str1%', percentKey2: 'str2%' },
            { label: '지능', key1: 'int1', key2: 'int2', percentKey1: 'int1%', percentKey2: 'int2%' },
            { label: '수비', key1: 'def1', key2: 'def2', percentKey1: 'def1%', percentKey2: 'def2%' },
            { label: '저항', key1: 'res1', key2: 'res2', percentKey1: 'res1%', percentKey2: 'res2%' },
            { label: '속도', key1: 'spd1', key2: 'spd2', percentKey1: 'spd1%', percentKey2: 'spd2%' }
        ];

        rows.forEach(row => {
            const value1 = jogressDataEntry[row.key1];
            const value2 = jogressDataEntry[row.key2];
            let rowHtml = `<tr><th>${row.label}</th>`;

            if (value1 || value2) {
                // 각 값 뒤에 %를 붙이거나 괄호로 퍼센트 값을 추가
                if (row.suffix) {  // 유대감 처리
                    rowHtml += `<td>${value1 ? value1 + row.suffix : ''}</td>`;
                    rowHtml += `<td>${value2 ? value2 + row.suffix : ''}</td>`;
                } else {  // 나머지 스탯들 처리
                    const percent1 = jogressDataEntry[row.percentKey1];
                    const percent2 = jogressDataEntry[row.percentKey2];
                    rowHtml += `<td>${value1 ? value1 + (percent1 ? ` (${percent1}%)` : '') : ''}</td>`;
                    rowHtml += `<td>${value2 ? value2 + (percent2 ? ` (${percent2}%)` : '') : ''}</td>`;
                }
                rowHtml += `</tr>`;
                tableHtml += rowHtml;
            }
        });

        // 마지막 행 (진화 재료), key2가 없으므로 병합 처리
        if (jogressDataEntry.ingredient) {
            tableHtml += `
                <tr>
                    <th>진화 재료</th>
                    <td colspan="2">${jogressDataEntry.ingredient}</td> <!-- 열 병합 -->
                </tr>`;
        }

        tableHtml += `</table>`;
        tooltip.innerHTML = tableHtml;  // 툴팁에 테이블 삽입
    }

    // 이미지 위치를 기준으로 툴팁 위치 설정
    const imgRect = jogressImage.getBoundingClientRect();  // 이미지의 위치 정보 가져오기
    tooltip.style.left = `${imgRect.left + window.scrollX}px`;  // 이미지의 왼쪽에 맞춤
    tooltip.style.top = `${imgRect.bottom + window.scrollY - 130}px`;  // 이미지의 바로 아래로 설정

    tooltip.classList.add('visible-tooltip');
}


// 툴팁 숨기는 함수
function hideJogressTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible-tooltip');
}


function showTooltip(event, digimonName) {
    const tooltip = document.getElementById('tooltip');
    const currentDigimon = allData.find(d => d.name === digimonName);

    if (!currentDigimon) {
        return;
    }

    // 현재 노드의 부모 노드를 찾기
    const parentNode = event.target.closest('.digimon-container').parentElement.closest('.digimon-container');
    
    let parentDigimonName = null;

    if (parentNode) {
        // 부모 노드의 디지몬 이미지 요소를 찾고 그 alt 값을 가져옴
        const parentImg = parentNode.querySelector('.digimon img:not(.type-image)'); // 타입 이미지가 아닌 디지몬 이미지 찾기
        if (parentImg) {
            parentDigimonName = parentImg.alt; // 부모 노드의 디지몬 이름 (alt 값) 저장
        }
    }

    // 부모 디지몬의 이름 (alt 값)을 사용해 allData에서 부모 디지몬 정보를 찾음
    const parentDigimon = allData.find(d => d.name === parentDigimonName);

    if (!parentDigimon) {
        return; // 부모 디지몬 정보를 찾지 못하면 중단
    }

    // 부모 디지몬의 조그레스 디지몬 여부 확인
    const jogressTarget = allData.some(digimon => digimon.조그레스 === digimonName);
    
    // 조그레스 대상이면 툴팁을 표시하지 않음
    if (jogressTarget) {
        return;
    }

    const digimonInfo = conditionData.find(d => d.name === parentDigimon.name);
    if (digimonInfo) {
        const thirdColumnValue = digimonInfo[Object.keys(digimonInfo)[2]];
        if (!thirdColumnValue) {
            return;
        }

        // 툴팁 테이블 구조 생성
        let tableHtml = `
        <table class="tooltip-table">
            <tr>
                <th colspan="2">진화 조건</th>
            </tr>`;

        if (digimonInfo['name']) {
            tableHtml += `
            <tr>
                <th>디지몬</th>
                <td>${digimonInfo['name']}</td>
            </tr>`;
        }

        if (digimonInfo['레벨']) {
            tableHtml += `
            <tr>
                <th>레벨</th>
                <td>${digimonInfo['레벨']}</td>
            </tr>`;
        }

        if (digimonInfo['유대감']) {
            tableHtml += `
            <tr>
                <th>유대감</th>
                <td>${digimonInfo['유대감']}%</td>
            </tr>`;
        }

        const statPairs = [
            { stat: '힘', percent: '힘%' },
            { stat: '지능', percent: '지능%' },
            { stat: '수비', percent: '수비%' },
            { stat: '저항', percent: '저항%' },
            { stat: '속도', percent: '속도%' }
        ];

        statPairs.forEach(pair => {
            const statValue = digimonInfo[pair.stat];
            const percentValue = digimonInfo[pair.percent];
            if (statValue) {
                tableHtml += `
                <tr>
                    <th>${pair.stat}</th>
                    <td>${statValue}${percentValue ? ` (${digimonInfo[pair.percent]}%)` : ''}</td>
                </tr>`;
            }
        });

        if (digimonInfo['진화재료']) {
            tableHtml += `
            <tr>
                <th>진화 재료</th>
                <td colspan="2">${digimonInfo['진화재료']}</td>
            </tr>`;
        }

        tableHtml += `</table>`;

        tooltip.innerHTML = tableHtml;
        tooltip.classList.add('visible-tooltip');

        updateTooltipPosition(event.target, tooltip);
        observeNodeChanges(event.target, tooltip);
    }
}




function updateTooltipPosition(targetElement, tooltipElement) {
    const rect = targetElement.getBoundingClientRect();
    
    tooltipElement.style.left = `${rect.left + window.scrollX - 2}px`; 
    tooltipElement.style.top = `${rect.top + window.scrollY - 80}px`; 
}

function observeNodeChanges(nodeElement, tooltipElement) {
    const plusBtn = nodeElement.querySelector('.plus-btn');
    if (plusBtn) {
        plusBtn.addEventListener('click', () => {
            setTimeout(() => {
                updateTooltipPosition(nodeElement, tooltipElement);
            }, 300);
        });
    }
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible-tooltip');
}

function updateAllVerticalLinesAndHorizontalConnectors() {
    const treeContainer = document.getElementById('evolution-tree');
    const allContainers = treeContainer.querySelectorAll('.digimon-container');

    allContainers.forEach(container => {
        const verticalLine = container.querySelector('.vertical-line');
        const childrenContainer = container.querySelector('.children-container');

        if (childrenContainer && childrenContainer.children.length > 0) {
            const firstChild = childrenContainer.firstChild;
            const lastChild = childrenContainer.lastChild;

            if (firstChild && lastChild) {
                const firstChildRect = firstChild.getBoundingClientRect();
                const lastChildRect = lastChild.getBoundingClientRect();
                const containerRect = childrenContainer.getBoundingClientRect();

                const lineLength = (lastChildRect.top + lastChildRect.height / 2) - (firstChildRect.top + firstChildRect.height / 2) ;
                const lineTop = (firstChildRect.top + firstChildRect.height / 2) - containerRect.top;

                verticalLine.style.height = `${lineLength}px`;
                verticalLine.style.top = `${lineTop}px`;
                verticalLine.style.display = 'block'; 

                [...childrenContainer.children].forEach((childNode) => {
                    const childRect = childNode.getBoundingClientRect();
                    const childTop = (childRect.top + childRect.height / 2) - containerRect.top;

                    let horizontalConnector = childNode.querySelector('.horizontal-connector');
                    if (!horizontalConnector) {
                        horizontalConnector = document.createElement('div');
                        horizontalConnector.classList.add('horizontal-connector');
                        childNode.appendChild(horizontalConnector);
                    }
                    horizontalConnector.style.top = '50%';
                    horizontalConnector.style.left = '-50px';
                    horizontalConnector.style.display = 'block';
                });
            }
        } else {
            verticalLine.style.display = 'none'; 
        }
    });
}

function createStageContainer(digimons, data, lowerEvolutions) {
    const stageContainer = document.createElement('div');
    stageContainer.classList.add('stage-container');

    digimons.forEach(digimon => {
        const digimonNode = createDigimonNode(digimon, data, lowerEvolutions);
        stageContainer.appendChild(digimonNode);
    });

    return stageContainer;
}

function createEvolutionTree(data, lowerEvolutions) {
    const treeContainer = document.getElementById('evolution-tree');
    treeContainer.innerHTML = '';
    const stageContainer = createStageContainer(data, allData, lowerEvolutions);
    treeContainer.appendChild(stageContainer);
}

const menuButtons = document.querySelectorAll('.menu-container button');

menuButtons.forEach(button => {
    button.addEventListener('click', () => {
        menuButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

function searchDigimonByName() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    
    const searchTerms = searchQuery.split(',').map(term => term.trim());

    const filteredData = allData.filter(digimon => {
        return searchTerms.some(term => digimon.name.toLowerCase().includes(term));
    });

    createDigimonImageList(filteredData);
}

loadCSV().then(() => {
    loadConditionCSV();
    loadJogressCSV(); // jogress 데이터를 불러옴
    loadCharactersCSV(); // characters 데이터를 불러옴
});