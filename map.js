let maps = {};

// JSON 데이터 처리
fetch('map.json')
    .then(response => response.json())
    .then(data => {
        maps = data;
        initMap();
    })
    .catch(error => console.error('Error loading JSON data:', error));

const imageContainer = document.getElementById('image-container');
const mapButtons = document.querySelectorAll('.map-button');
const dropdownContent = document.querySelector('.dropdown-content');

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
    tooltip.style.left = `${imageBottomRightX - 10}px`;
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

            dropdownContent.innerHTML = '';

            if (selectedMap.portals && selectedMap.portals.length > 0) {
                createCheckbox('포탈', 'toggle-portals', '포탈 아이콘', selectedMap.portals, currentPortals);
            }

            if (selectedMap.warps && selectedMap.warps.length > 0) {
                createCheckbox('워프 포인트', 'toggle-warps', '워프포인트 아이콘', selectedMap.warps, currentWarps);
            }

            if (selectedMap.shops && selectedMap.shops.length > 0) {
                createCheckbox('상점', 'toggle-shops', '상점 아이콘', selectedMap.shops, currentShops);
            }

            if (selectedMap.overflows && selectedMap.overflows.length > 0) {
                createCheckbox('오버플로우', 'toggle-overflows', '오버플로우 아이콘', selectedMap.overflows, currentOverflows);
            }

            if (selectedMap.datacube && selectedMap.datacube.length > 0) {
                createCheckbox('데이터 큐브', 'toggle-datacube', '데이터큐브 아이콘', selectedMap.datacube, currentDatacube);
            }

            if (selectedMap.mobs && selectedMap.mobs.length > 0) {
                createCheckbox('악역 디지몬', 'toggle-mob', '몬스터 아이콘', selectedMap.mobs, currentMobs);
            }

            updateActiveButton(this);
        });
    });

    mapButtons[0].click();
}

function createCheckbox(labelText, checkboxId, iconName, mapData, currentArray) {
    const div = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');

    input.type = 'checkbox';
    input.id = checkboxId;
    if (checkboxId === 'toggle-warps' || checkboxId === 'toggle-portals' || checkboxId === 'toggle-overflows') {
        input.checked = true;
    } else {
        input.checked = false;
    }

    label.htmlFor = checkboxId;
    label.textContent = labelText;

    div.appendChild(input);
    div.appendChild(label);
    dropdownContent.appendChild(div);

    input.addEventListener('change', function() {
        const displayStyle = this.checked ? 'block' : 'none';
        currentArray.forEach(item => {
            if (item.mobImage) {
                item.mobImage.style.display = displayStyle;
                item.typeImage.style.display = displayStyle;
                if (item.evolIcon) {
                    item.evolIcon.style.display = displayStyle;
                }
            } else {
                item.style.display = displayStyle;
            }
        });
    });

    mapData.forEach(item => {
        const imgElement = document.createElement('img');
        imgElement.src = item.src;
        imgElement.style.position = 'absolute';
        imgElement.style.top = `${item.top}px`;
        imgElement.style.left = `${item.left}px`;
        imgElement.style.display = input.checked ? 'block' : 'none';

        if (item.isAggressive) {
            imgElement.style.border = '2px solid red';
        }

        let evolIcon = null;
        if (item.evol) {
            evolIcon = document.createElement('img');
            evolIcon.src = 'image/icon.png';
            evolIcon.style.position = 'absolute';
            evolIcon.style.top = `${item.top + 25}px`;
            evolIcon.style.left = `${item.left + 8}px`;
            evolIcon.style.width = '20px';
            evolIcon.style.height = '20px';
            evolIcon.style.zIndex = '1001';
            evolIcon.style.display = input.checked ? 'block' : 'none';
            imageContainer.appendChild(evolIcon);
        }

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
        
        if (checkboxId === 'toggle-mob') {
            imgElement.classList.add('mob-image');

            const typeElement = document.createElement('img');
            typeElement.src = `image/${item.type}.webp`;
            typeElement.style.position = 'absolute';
            typeElement.style.top = `${item.top - 5}px`;
            typeElement.style.left = `${item.left - 5}px`;
            typeElement.style.width = `18px`;
            typeElement.style.height = `19px`;
            typeElement.style.zIndex = `1000`;
            typeElement.style.display = input.checked ? 'block' : 'none';

            addSpecialTooltipToMobs(imgElement, item.name, item.src, item.level, item.hp, item.강점, item.약점, item.items, item.evol);

            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(typeElement);

            currentArray.push({ mobImage: imgElement, typeImage: typeElement, evolIcon: evolIcon });
        } else {
            addTooltipToImage(imgElement, item.tooltip);
            imageContainer.appendChild(imgElement);
            currentArray.push(imgElement);
        }
    });
}

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
        <div style="text-align: center; font-size: 20px; color: rgb(0,183,255); font-weight: bold;">${name}</div>
        <div style="display: flex; align-items: center;">
            <img src="${src}" alt="${name}" style="width: 100px; height: 100px; margin-top: 5px; background-color: #000000; border-radius: 5px; border: 1px solid white;">
            <div style="margin-left: 5px;">
                <div style="margin-bottom: 5px; margin-top: 5px; color: white;"><span>레벨 :</span> ${level}</div>
                <div style="margin-bottom: 5px; color: white;"><span>체력 :</span> ${hp}</div>
                <div style= "color: white;"><span>강점 :</span> 
                    <div style="background-image: url('image/strongbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${강점이미지 ? `<img src="${강점이미지}" alt="${강점Parts[0]}" style="width: 24px; height: 24px;">` : ''}
                    </div>
                    ${강점텍스트 ? `<span>${강점텍스트}</span>` : ''}
                </div>
                <div style= "color: white;"><span>약점 :</span>
                    <div style="background-image: url('image/weakbackground.webp'); background-size: cover; width: 25px; height: 25px; display: inline-block; vertical-align: middle;">
                        ${약점이미지 ? `<img src="${약점이미지}" alt="${약점Parts[0]}" style="width: 24px; height: 24px;">` : ''}
                    </div>
                    ${약점텍스트 ? `<span>${약점텍스트}</span>` : ''}
                </div>
            </div>
        </div>
        <div style="text-align: center; font-size: 20px; margin-top: 10px; color: rgb(0,183,255);"><strong>드랍 아이템</strong> 
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
        <div style="text-align: center; font-size: 20px; margin-top: 10px; color: rgb(0,183,255);"><strong>조건 진화</strong></div>
        <div style="display: flex; justify-content: center; align-items: center; margin-top: 10px;">
        <img src="image/digimon/${evol}/${evol}.webp" alt="${evol}" style="width: 50px; height: 50px; background-color: black; border-radius: 5px; border: 1px solid white;">
         </div>
        ` : ''}
    `;

    document.body.appendChild(tooltip);

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

dropdownButton.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');

    if (dropdownContent.classList.contains('show')) {
        arrow.innerText = '▲';
    } else {
        arrow.innerText = '▼';
    }
});
