// JSON 데이터를 불러오는 함수
async function fetchDetectorData() {
  try {
      const response = await fetch('detector.json');
      const data = await response.json();
      return data;
  } catch (error) {
      console.error('Error fetching detector data:', error);
  }
}

// 페이지 로드 시 JSON 데이터를 불러오고 버튼에 이벤트 리스너를 추가
document.addEventListener('DOMContentLoaded', async function () {
  const detectorData = await fetchDetectorData();
  const detectorButtons = document.querySelectorAll('.detector-button');

  detectorButtons.forEach(button => {
    button.addEventListener('click', () => {
      // 모든 탐지기 버튼에서 active 클래스 제거
      detectorButtons.forEach(btn => btn.classList.remove('active'));
      
      // 클릭한 버튼에 active 클래스 추가
      button.classList.add('active');

      const detector = button.getAttribute('data-detector');
      displayMobButtons(detectorData, detector);
    });
  });
});

// 악역 디지몬 버튼을 동적으로 생성하는 함수
function displayMobButtons(detectorData, detector) {
  const mobButtonsContainer = document.querySelector('.mob-buttons');
  mobButtonsContainer.innerHTML = ''; // 기존 버튼 초기화

  const digimons = detectorData[detector]?.['악역 디지몬'];
  
  if (!digimons) {
      console.error('No digimon data found for the selected detector');
      return;
  }

  Object.keys(digimons).forEach(digimonName => {
      const digimon = digimons[digimonName];
      
      // 베놈묘티스몬 제외
      if (digimonName === '베놈묘티스몬') return;

      const button = document.createElement('button');
      button.className = 'mob-button';
      button.innerText = digimonName;

      // 클릭 시 해당 버튼에 active 클래스 추가
      button.addEventListener('click', () => {
        // 모든 악역 디지몬 버튼에서 active 클래스 제거
        document.querySelectorAll('.mob-button').forEach(btn => btn.classList.remove('active'));
        
        // 클릭한 버튼에 active 클래스 추가
        button.classList.add('active');

        showDigimonInfo(detector, digimonName, digimon);
      });

      mobButtonsContainer.appendChild(button);
  });
}

// 디지몬 정보를 표시하고, 맵과 디지몬 이미지를 띄우는 함수
function showDigimonInfo(detector, digimonName, digimon) {
  const mapName = digimon.map;
  const coordinates = digimon.coordinates;
  
  displayMapImage(mapName, digimonName, coordinates);
  showDigimonDetails(digimonName, digimon);  // 디지몬 세부 정보 표시
}

// 디지몬 정보를 오른쪽에 표시하는 함수
function showDigimonDetails(digimonName, digimon) {
  const detailContainer = document.querySelector('.detail');
  detailContainer.innerHTML = ''; // 기존 정보를 초기화

  // 디지몬 이름에서 특수 문자나 공백을 _ 등으로 치환
  const formattedDigimonName = digimonName.replace(/\s/g, '_').replace(/:/g, '_');

  // 타입 이미지 경로 설정
  const typeImagePath = `image/${digimon.type}.webp`;

  const strongParts = digimon.strong ? digimon.strong.split(',') : ['없음'];
  const strongImage = strongParts[0] ? `image/${strongParts[0].trim()}.webp` : null;
  const strongText = strongParts[1] ? strongParts[1].trim() : '';

  const weakParts = digimon.weak ? digimon.weak.split(',') : ['없음'];
  const weakImage = weakParts[0] ? `image/${weakParts[0].trim()}.webp` : null;
  const weakText = weakParts[1] ? weakParts[1].trim() : '';

  // 디지몬 사진을 HTML로 추가
  const digimonImage = `
    <img src="image/digimon/${formattedDigimonName}/${formattedDigimonName}.webp" 
         alt="${digimonName}" 
         style="width: 60%; border-radius: 10px; margin-bottom: 10px; background-color: black;"
         onerror="this.src='image/digimon/default.webp';">
  `;

  // 투명한 배경의 이름, 타입, 체력 정보 포함
  const digimonInfo = `
    <div style="width: 60%; height: 65px; background: rgba(0, 0, 0, 0.5); border-radius: 10px; color: white; padding: 10px; position: relative; margin-bottom: 15px;">
      <img src="${typeImagePath}" alt="${digimon.type}" 
           style="width: 25px; height: 25px; position: absolute; left: 15px; top: 30%; transform: translateY(-50%);"
           onerror="this.src='image/default-type.webp';">
      <p class="font-applied" style="text-align: center; margin: 0; line-height: 20px;">${digimonName}</p>
      <div style="position: relative; width: 100%; margin-top: 10px;">
        <img src="image/map/hp.png" alt="HP Bar" style="width: 100%; height: 20px; display: block;">
        <p class="font-applied" style="position: absolute; top: 30%; left: 50%; transform: translate(-50%, -50%); color: white;">
          ${digimon.HP}
        </p>
      </div>
      <div style="position: absolute; top: 5px; right: -220px; width: 200px;">
        <!-- 강점 정보 (이미지 + 텍스트) -->
        <div style="display: flex; align-items: left; margin-bottom: 5px;">
          <p class="font-applied" style="color: black; font-weight: bold;">* 강점 :</p>
          ${strongImage ? `<img src="${strongImage}" alt="강점" style="width: 25px; height: 25px; margin-right: 5px; background-image: url('image/strongbackground.webp'); background-size: 120%; background-position: center; margin-left:5px;">` : ''}
          <p class="font-applied" style="color: black; font-weight: bold;">${strongText}</p>
        </div>
        
        <!-- 약점 정보 (이미지 + 텍스트) -->
        <div style="display: flex; align-items: left; margin-bottom: 5px;">
          <p class="font-applied" style="color: black; font-weight: bold;">* 약점 : </p>
          ${weakImage ? `<img src="${weakImage}" alt="약점" style="width: 25px; height: 25px; margin-right: 5px; background-image: url('image/weakbackground.webp'); background-size: 120%; background-position: center; margin-left:5px;">` : ''}
          <p class="font-applied" style="color: black; font-weight: bold;">${weakText}</p>
        </div>
      </div>
    </div>
  `;

  // 전체 디테일 내용을 구성
  const detailContent = `
    ${digimonInfo}
    ${digimonImage}
  `;

  // 최종 HTML을 컨테이너에 삽입
  detailContainer.innerHTML = detailContent;
}

// 맵 이미지를 표시하고, 악역 디지몬 이미지를 특정 좌표에 표시
function displayMapImage(mapName, digimonName, coordinates) {
  const mapContainer = document.getElementById('map-container');
  mapContainer.innerHTML = ''; // 기존 이미지 및 요소 제거

  // ??? 맵에 대한 특수 처리 (ApocalymonArea.png)
  let imageName = mapName === '???' ? 'ApocalymonArea.png' : `${mapName.replace(/\s/g, '')}.webp`;

  console.log(`Map Image Path: image/map/detector/${imageName}`); // 이미지 경로 확인용 로그

  const img = document.createElement('img');
  img.src = `image/map/detector/${imageName}`;
  img.alt = mapName;
  img.style.width = '500px';
  img.style.height = '500px';
  img.style.position = 'relative'; // 디지몬 이미지를 위치시키기 위해 relative 사용

  // 이미지 로드 실패 시 로그 출력
  img.onerror = function () {
      console.error(`Failed to load image: ${img.src}`);
  };

  // 디지몬 이름에서 특수 문자나 공백을 _ 등으로 치환 (예: 공백은 _로)
  const formattedDigimonName = digimonName.replace(/\s/g, '_').replace(/:/g, '_');

  // 디지몬 이미지 추가 (지정된 좌표에 50x50 크기로 표시)
  const digimonImage = document.createElement('img');
  digimonImage.src = `image/digimon/${formattedDigimonName}/${formattedDigimonName}.webp`;
  digimonImage.alt = digimonName;
  digimonImage.style.width = '30px';
  digimonImage.style.height = '30px';
  digimonImage.style.position = 'absolute'; // 맵 위에 겹쳐서 표시하기 위한 설정
  digimonImage.style.backgroundColor = 'black';
  digimonImage.style.borderRadius = '3px';

  // 좌표가 없을 경우 기본 좌표 설정 (예: 좌상단)
  const x = coordinates && coordinates.x ? coordinates.x : 0;
  const y = coordinates && coordinates.y ? coordinates.y : 0;

  digimonImage.style.left = `${x}px`; // x 좌표
  digimonImage.style.top = `${y}px`;  // y 좌표

  digimonImage.classList.add('blinking');

  // 디지몬 이미지 로드 실패 시 로그 출력
  digimonImage.onerror = function () {
      console.error(`Failed to load digimon image: ${digimonImage.src}`);
  };

  mapContainer.appendChild(img);      // 맵 이미지 추가
  mapContainer.appendChild(digimonImage); // 디지몬 이미지 추가
}
