// URL에서 쿼리 매개변수 가져오기
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // 페이지가 로드되면 캐릭터 이름에 맞는 정보를 로드하고 표시
  document.addEventListener('DOMContentLoaded', () => {
    const characterName = decodeURIComponent(getQueryParam('name')); // URL에서 캐릭터 이름 가져오기
    if (!characterName) {
      document.getElementById('character-name').textContent = '캐릭터 정보를 찾을 수 없습니다.';
      return;
    }
  
    document.getElementById('character-name').textContent = characterName; // 캐릭터 이름 설정
    const sanitizedCharacterName = characterName.replace(/:/g, '_');
  
    // CSV 파일에서 캐릭터 정보 불러오기
    fetch('characters.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // 데이터에서 첫 번째 줄은 헤더이므로 제외
        const character = rows.find(row => row.includes(characterName));
 
        if (character) {
          const columns = character.split(',');
          const characterImgPath = `image/digimon/${sanitizedCharacterName}/${sanitizedCharacterName}.webp`;
          const evolutionStage = columns[1]; // 진화 등급 가져오기
          const type = columns[2]; // 타입 가져오기
          const fields = columns[15] ? columns[15].split(';').map(field => field.trim()) : []; 

                // 필드 이미지 설정
          for (let i = 1; i <= 3; i++) {
              const fieldImgElement = document.getElementById(`field-img${i}`);
              if (fields[i - 1]) {
                  fieldImgElement.src = `image/field/${fields[i - 1]}.webp`;
                  fieldImgElement.alt = `${fields[i - 1]} 이미지`;
                  fieldImgElement.title = `${fields[i - 1]}`;
                  fieldImgElement.style.display = 'inline'; 
              } else {
                  fieldImgElement.style.display = 'none'; 
              }
          }
  
          // 캐릭터 기본 정보 표시
          document.getElementById('character-img').src = characterImgPath;

          // 진화 등급 이미지 설정 (확장자가 .webp인 이미지를 로드)
          const evolutionImgPath = `image/${evolutionStage}.webp`;
          document.getElementById('evolution-img').src = evolutionImgPath;

          // 타입 이미지 설정
          const typeImgPath = `image/${type}.webp`;
          document.getElementById('type-img').src = typeImgPath

          // 캐릭터 스탯 정보 설정 (각각의 값을 CSV 파일에서 불러와서 적용)
          document.getElementById('stat-level').textContent = columns[3];
          document.getElementById('stat-hp').textContent = columns[4];
          document.getElementById('stat-sp').textContent = columns[5];
          document.getElementById('stat-power').textContent = columns[6];
          document.getElementById('stat-intelligence').textContent = columns[7];
          document.getElementById('stat-defense').textContent = columns[8];
          document.getElementById('stat-resistance').textContent = columns[9];
          document.getElementById('stat-speed').textContent = columns[10];
  
          // 스킬 정보 로드 (CSV 파일을 가정하고 로드)
          Promise.all([
            fetch('skill1.csv').then(res => res.text()),
            fetch('skill2.csv').then(res => res.text()),
            fetch('skill3.csv').then(res => res.text())
          ]).then(([skill1Data, skill2Data, skill3Data]) => {
            const skills = [skill1Data, skill2Data, skill3Data];
            const skillNames = ['1스킬', '2스킬', '3스킬'];
  
            // 테이블에 스킬 정보 표시
            const skillDetailsTable = document.getElementById('skill-details');
            skillDetailsTable.innerHTML = ''; // 테이블 초기화
  
            let isAdultStage = false; // 성장기인지 여부
  
            skills.forEach((skillData, index) => {
              const skillRows = skillData.split('\n').slice(1); // 헤더 제외
              const skill = skillRows.find(row => {
                const columns = row.split(',');
                return columns[10].trim() === characterName;
              });
  
              if (skill) {
                const skillColumns = skill.split(',');
  
                // 진화 단계가 성장기인지 확인 (11번째 열에 해당)
                if (skillColumns[11] === '성장기') {
                  isAdultStage = true; // 성장기임을 표시
                }
  
                // 성장기라면 3스킬을 표시하지 않음
                if (index === 2 && isAdultStage) {
                  return; // 3스킬 생략
                }
  
                const skillImgPath = `image/digimon/${sanitizedCharacterName}/skill${index + 1}.webp`; // 각 스킬에 맞는 이미지 경로 생성
                const skill1ImgPath = `image/${skillColumns[15]}.webp`; // 각 스킬에 맞는 이미지 경로 생성
  
                const hitCount = isNaN(parseFloat(skillColumns[13])) ? 1 : parseFloat(skillColumns[13]); // 타수 값 가져오기, 기본값 1로 설정

                const levelData = skillColumns.slice(0, 10).map(value => {
                  // 값이 없거나 숫자로 변환할 수 없으면 0을 사용
                  let percentage = isNaN(parseFloat(value)) ? 0 : parseFloat(value) * 100;
                
                  // 타수 값을 곱함
                  const totalDamage = percentage * hitCount;
                  
                  // 소수점이 있는 경우만 표시, 그렇지 않으면 정수만 반환
                  return `${parseFloat(totalDamage.toFixed(2))}%`;
                });
                
                const newRow = `
                <tr>
                  <!-- 스킬 아이콘과 텍스트를 2줄로 배치 -->
                  <td rowspan="2" style="width: 50px;">
                    <img src="${skillImgPath}" alt="스킬 아이콘" style="width: 50px; border-radius: 50%; margin-top: 20px; margin-right: -25px; border: 0.1px solid grey; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); position: relative;
                    left: 50px; top: -30px;">
                  </td>
                  <!-- 스킬 이름, 속성 부분 한 줄 -->
                  <td colspan="3" style="vertical-align: middle; position: relative; left: 50px; top: -30px;">
                    <div style="font-size: 16px; font-weight: bold; display: flex; align-items: center; margin-top: 12px; margin-left: 8px;">
                      <span>${skillColumns[12]}</span> <!-- 스킬 이름 -->
                      <img src="${skill1ImgPath}" alt="속성" style="width: 22px; margin-left: 5px; background-image: url('image/background.webp'); background-size: 120%; background-position: center; "> <!-- 속성 이미지 -->
                    </div>
                  </td>
                </tr>
                <tr>
                  <!-- 아래쪽에는 범위, 타겟 수, 타수 정보를 한 줄에 표시 -->
                  <td style="background-color: ${skillColumns[14] === '원거리' ? 'green' : '#D32F2F'}; color: white; border-radius: 5px; padding: 2px 2px; font-size: 13px; display: inline-block; text-align: center; font-weight: bold; vertical-align: middle; margin-left: 8px; position: relative;
                    left: 50px; top: -30px;">
                    ${skillColumns[14]} <!-- 범위 -->
                  </td>
                  <td style="background-color: #D32F2F; color: white; border-radius: 5px; padding: 2px 2px; font-size: 13px; display: inline-block; text-align: center; font-weight: bold; vertical-align: middle; margin-left: 5px; position: relative;
                    left: 50px; top: -30px;">
                    ${skillColumns[16]} ${skillColumns[17]} <!-- 타겟 수 -->
                  </td>
                  <td style="background-color: green; color: white; border-radius: 5px; padding: 2px 2px; font-size: 13px; display: inline-block; text-align: center; font-weight: bold; vertical-align: middle; margin-left: 5px; position: relative;
                    left: 50px; top: -30px;">
                    ${isNaN(skillColumns[13]) ? skillColumns[13] : `${skillColumns[13]}타`} <!-- 타수 -->
                  </td>
                  </td>
                    ${skillColumns[18] ? `<td style="background-color: #D32F2F; color: white; border-radius: 5px; padding: 2px 2px; font-size: 13px; display: inline-block; text-align: center; font-weight: bold; vertical-align: middle; margin-left: 5px; position: relative;
                    left: 50px; top: -30px;">
                    ${skillColumns[18]} <!-- 효과 -->
                  </td>` : ''}
                  ${skillColumns[19] ? `<td style="background-color: grey; color: white; border-radius: 5px; padding: 2px 2px; font-size: 13px; display: inline-block; text-align: center; font-weight: bold; vertical-align: middle; margin-left: 5px; position: relative;
                    left: 50px; top: -30px;">
                    추가 시전 턴 : ${skillColumns[19]}턴 <!-- 캐스팅 턴 -->
                  </td>` : ''}
                </tr>
                <tr>
                    <!-- 레벨별 데미지 표 -->
                    <td colspan="6">
                        <table class="level-table" style="width: 100%; border-collapse: collapse; solid #ccc; margin-top: 10px; position: relative; left: 50px; top: -30px;">
                            <tr>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">1레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">2레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">3레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">4레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">5레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">6레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">7레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">8레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">9레벨</th>
                                <th style="border: 1px solid #ccc; font-size: 14px; vertical-align: middle; padding: 5px; background-color: rgb(229,229,229); width: 70px; height: 35px;">10레벨</th>
                            </tr>
                            <tr>
                                ${levelData.map(level => `<th style="border: 1px solid #ccc; font-size: 13px; vertical-align: middle; padding: 7px; width: 70px; height: 35px;">${level}</td>`).join('')} <!-- 각 레벨별 데미지 출력 -->
                            </tr>
                        </table>
                    </td>
                </tr>
              `;
              skillDetailsTable.innerHTML += newRow;
              }
            });
          });
        } else {
          document.getElementById('character-name').textContent = '캐릭터 정보를 찾을 수 없습니다.';
        }
      });
  });
  