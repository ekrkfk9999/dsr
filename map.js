let maps = {};

// JSON 데이터 처리
fetch('scaled_map_data.json')
    .then(response => response.json())
    .then(data => {
        maps = data;
        initMap();
    })
    .catch(error => console.error('Error loading JSON data:', error));

const imageContainer = document.getElementById('image-container');
const mapButtons = document.querySelectorAll('.map-button');
const dropdownContent = document.querySelector('.dropdown-content'); // 드롭다운 컨텐츠 부분

let currentPortals = [];
let currentWarps = [];
let currentShops = [];
let currentOverflows = [];
let currentDatacube = [];
let currentMobs = [];

function addTooltipToImage(imageElement, tooltipText) {
    imageElement.addEventListener('mouseenter', function(event) {
        showTooltipAtImageBottomRight(event, imageElement, tooltipText);
    });
    imageElement.addEventListener('mouseleave', hideTooltip);
}

function showTooltipAtImageBottomRight(event, imageElement, text) {
    let tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = text;

    const rect = imageElement.getBoundingClientRect();
    const imageBottomRightX = rect.right + window.pageXOffset;
    const imageBottomRightY = rect.bottom + window.pageYOffset;

    tooltip.style.position = 'absolute';
    tooltip.style.left = `${imageBottomRightX-10}px`;
    tooltip.style.top = `${imageBottomRightY}px`;

    document.body.appendChild(tooltip);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function initMap() {
    mapButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedMap = maps[this.getAttribute('data-map')];
            imageContainer.style.backgroundImage = `url(${selectedMap.backgroundImage})`;
            imageContainer.innerHTML = '';
            currentPortals = [];
            currentWarps = [];
            currentShops = [];
            currentOverflows = [];
            currentDatacube = [];
            currentMobs = [];

            // 드롭다운 체크박스를 동적으로 생성하기 전에 기존 내용 초기화
            dropdownContent.innerHTML = '';

            // 포탈 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.portals && selectedMap.portals.length > 0) {
                createCheckbox('포탈', 'toggle-portals', '포탈 아이콘', selectedMap.portals, currentPortals);
            }

            // 워프포인트 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.warps && selectedMap.warps.length > 0) {
                createCheckbox('워프 포인트', 'toggle-warps', '워프포인트 아이콘', selectedMap.warps, currentWarps);
            }

            // 상점 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.shops && selectedMap.shops.length > 0) {
                createCheckbox('상점', 'toggle-shops', '상점 아이콘', selectedMap.shops, currentShops);
            }

            // 오버플로우 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.overflows && selectedMap.overflows.length > 0) {
                createCheckbox('오버플로우', 'toggle-overflows', '오버플로우 아이콘', selectedMap.overflows, currentOverflows);
            }

            // 데이터큐브 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.datacube && selectedMap.datacube.length > 0) {
                createCheckbox('데이터 큐브', 'toggle-datacube', '데이터큐브 아이콘', selectedMap.datacube, currentDatacube);
            }

            // 몬스터 데이터가 있는 경우에만 체크박스 생성
            if (selectedMap.mobs && selectedMap.mobs.length > 0) {
                createCheckbox('악역 디지몬', 'toggle-mob', '몬스터 아이콘', selectedMap.mobs, currentMobs);
            }

            updateActiveButton(this);
        });
    });

    mapButtons[0].click();
}

// 동적으로 체크박스를 생성하는 함수
function createCheckbox(labelText, checkboxId, iconName, mapData, currentArray) {
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'checkbox';
    input.id = checkboxId;
    input.checked = true;

    label.htmlFor = checkboxId;
    label.textContent = labelText;

    div.appendChild(input);
    div.appendChild(label);
    dropdownContent.appendChild(div);
    
    // 체크박스 클릭 시 해당 요소들의 가시성을 토글
    input.addEventListener('change', function() {
        const displayStyle = this.checked ? 'block' : 'none';
        currentArray.forEach(item => {
            // 각 아이콘에 대해 처리
            if (item.mobImage) {
                // 몹 이미지일 경우
                item.mobImage.style.display = displayStyle;
                item.typeImage.style.display = displayStyle;
                if (item.evolIcon) {
                    item.evolIcon.style.display = displayStyle;
                }
            } else {
                // 일반 아이콘일 경우
                item.style.display = displayStyle;
            }
        });
    });

    // 지도에 해당 요소(아이콘) 추가
    mapData.forEach(item => {
        const imgElement = document.createElement('img');
        imgElement.src = item.src;
        imgElement.style.position = 'absolute';
        imgElement.style.top = `${item.top}px`;
        imgElement.style.left = `${item.left}px`;
        imgElement.style.display = input.checked ? 'block' : 'none';

        if (item.isAggressive) {
            imgElement.style.border = '2px solid red';  // 빨간 테두리
        }

        let evolIcon = null;
        if (item.evol) {
            evolIcon = document.createElement('img');
            evolIcon.src = 'image/icon.png';  // 작은 아이콘 경로
            evolIcon.style.position = 'absolute';
            evolIcon.style.top = `${item.top + 25}px`;  // 위치 조정 (몹 이미지 아래)
            evolIcon.style.left = `${item.left + 8}px`; // 위치 조정 (중앙)
            evolIcon.style.width = '20px';
            evolIcon.style.height = '20px';
            evolIcon.style.zIndex = '1001'; // 몹 이미지보다 위에 표시
            evolIcon.style.display = input.checked ? 'block' : 'none';  // 체크박스 상태에 따라 초기 표시 여부 설정
            imageContainer.appendChild(evolIcon);
        }

        // 아이콘 타입에 맞는 클래스를 추가하여 CSS 적용
        if (checkboxId === 'toggle-portals') {
            imgElement.classList.add('portal-image');
        } else if (checkboxId === 'toggle-warps') {
            imgElement.classList.add('warp-image');
        } else if (checkboxId === 'toggle-shops') {
            imgElement.classList.add('shop-image');
        } else if (checkboxId === 'toggle-overflows') {
            imgElement.classList.add('overflows-image');
        } else if (checkboxId === 'toggle-datacube') {
            imgElement.classList.add('datacube-image');
        }

        // mobs 전용 로직: 몹과 타입 이미지를 함께 추가
        if (checkboxId === 'toggle-mob') {
            imgElement.classList.add('mob-image');  // 이 코드로 'mob-image' 클래스를 추가

            // 몹 이미지와 타입 이미지를 함께 표시
            const typeElement = document.createElement('img');
            typeElement.src = `image/${item.type}.webp`; // type 이미지 경로
            typeElement.style.position = 'absolute';
            typeElement.style.top = `${item.top -5}px`;  // 위치 조정
            typeElement.style.left = `${item.left -5}px`; // 위치 조정
            typeElement.style.width = `18px`;
            typeElement.style.height = `19px`;
            typeElement.style.zIndex = `1000`;
            typeElement.style.display = input.checked ? 'block' : 'none';

            // 몹에만 특별한 툴팁 적용
            addSpecialTooltipToMobs(imgElement, item.name, item.src, item.level, item.hp, item.강점, item.약점, item.items, item.evol);

            // 이미지 컨테이너에 몹과 타입 이미지를 추가
            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(typeElement);

            // currentArray에 몹, 타입 이미지, evol 아이콘을 객체로 저장
            currentArray.push({ mobImage: imgElement, typeImage: typeElement, evolIcon: evolIcon });
        } else {
            // 일반 아이콘에 툴팁 추가
            addTooltipToImage(imgElement, item.tooltip);
            
            // 이미지 컨테이너에 일반 아이콘 추가
            imageContainer.appendChild(imgElement);
            currentArray.push(imgElement); // 배열에 일반 아이콘 추가
        }
    });
}

// mobs 전용 툴팁 처리 함수
function addSpecialTooltipToMobs(imageElement, name, src, level, hp, 강점, 약점, items, evol) {
    imageElement.addEventListener('mouseenter', function(event) {
        showSpecialTooltipAtImage(event, imageElement, name, src, level, hp, 강점, 약점, items, evol); 
    });
    imageElement.addEventListener('mouseleave', hideSpecialTooltip); 
}

function showSpecialTooltipAtImage(event, imageElement, name, src, level, hp, 강점, 약점, items, evol) {
    let tooltip = document.createElement('div');
    tooltip.className = 'special-tooltip'; 

    const 강점Parts = 강점.split(','); 
    const 강점이미지 = 강점Parts[0] ? `image/${강점Parts[0].trim()}.webp` : null; 
    const 강점텍스트 = 강점Parts[1] ? 강점Parts[1].trim() : '';

    const 약점Parts = 약점.split(','); 
    const 약점이미지 = 약점Parts[0] ? `image/${약점Parts[0].trim()}.webp` : null;
    const 약점텍스트 = 약점Parts[1] ? 약점Parts[1].trim() : ''; 

    const 드랍아이템목록 = Array.isArray(items) ? items : [];

    tooltip.innerHTML = `
        <div style="text-align: center; font-size: 20px; font-weight: bold; color: rgb(0,183,255);">${name}</div>
        <div style="display: flex; align-items: center;">
            <img src="${src}" alt="${name}" style="width: 100px; height: 100px; margin-top: 5px; background-color: #000000; border-radius: 5px; border: 1px solid white;">
            <div style="margin-left: 5px;">
                <div style="margin-bottom: 5px; margin-top: 5px; color: white;"><strong>레벨 :</strong> ${level}</div>
                <div style="margin-bottom: 5px; color: white;"><strong>체력 :</strong> ${hp}</div>
                <div style= "color: white;"><strong>강점 :</strong> 
                    <div style="background-image: url('image/strongbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${강점이미지 ? `<img src="${강점이미지}" alt="${강점Parts[0]}" style="width: 24px; height: 24px;">` : ''}
                    </div>
                    ${강점텍스트 ? `<span>${강점텍스트}</span>` : ''}
                </div>
                <div style= "color: white;"><strong>약점 :</strong>
                    <div style="background-image: url('image/weakbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${약점이미지 ? `<img src="${약점이미지}" alt="${약점Parts[0]}" style="width: 24px; height: 24px;">` : ''}
                    </div>
                    ${약점텍스트 ? `<span>${약점텍스트}</span>` : ''}
                </div>
            </div>
        </div>
        <div style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 10px; color: rgb(0,183,255);"><strong>드랍 아이템</strong> 
            <ul style="margin-top: 5px; list-style-type: none; padding-left: 0; font-size: 14px; text-align: left; color: white;">
                ${드랍아이템목록.map(item => {
                    const itemImageSrc = item.includes("조합법") ? 'image/item/조합법.png' : `image/item/${item.trim()}.png`;
                    return `
                        <li style="display: flex; align-items: center; justify-content: flex-start; margin-bottom: 5px; margin-left: 5px;">
                            <img src="${itemImageSrc}" alt="${item.trim()}" style="width: 25px; height: 25px; margin-right: 5px; background-color: black; border-radius: 5px; border: 1px solid grey; vertical-align: middle;">
                            ${item.trim()}
                        </li>`;
                }).join('')}
            </ul>
        </div>
        ${evol ? `
        <div style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 10px; color: rgb(0,183,255);"><strong>조건 진화</strong></div>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
        <img src="image/digimon/${evol}/${evol}.webp" alt="${evol}" style="width: 50px; height: 50px; background-color: black; border-radius: 5px; border: 1px solid white;">
         </div>
        ` : ''}
    `;

    document.body.appendChild(tooltip);

    // 툴팁 위치 조정
    const rect = imageElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const imageBottomRightX = rect.right + window.pageXOffset;
    const imageBottomRightY = rect.bottom + window.pageYOffset;
    
    const containerRect = imageContainer.getBoundingClientRect();
    
    let tooltipTop = imageBottomRightY;
    if (tooltipTop + tooltipRect.height > containerRect.bottom + window.pageYOffset) {
        tooltipTop = containerRect.bottom + window.pageYOffset - tooltipRect.height - 10;
    }
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${imageBottomRightX + 10}px`;
    tooltip.style.top = `${tooltipTop}px`;
}
// 특별한 툴팁 숨기기 함수 (특별한 툴팁만)
function hideSpecialTooltip() {
    const tooltip = document.querySelector('.special-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

function updateActiveButton(activeButton) {
    mapButtons.forEach(button => {
        button.classList.remove('active');
    });
    activeButton.classList.add('active');
}

const dropdownButton = document.querySelector('.dropdown-button');
const arrow = document.querySelector('.arrow');

// 드롭다운 버튼 클릭 시 리스트 열기/닫기
dropdownButton.addEventListener('click', function() {
  dropdownContent.classList.toggle('show'); // 'show' 클래스를 토글하여 열고 닫음

  // 화살표 모양 변경
  if (dropdownContent.classList.contains('show')) {
    arrow.innerText = '▲'; // 펼쳐졌을 때 위쪽 화살표
  } else {
    arrow.innerText = '▼'; // 접혔을 때 아래쪽 화살표
  }
});