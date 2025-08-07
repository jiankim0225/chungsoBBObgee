
document.addEventListener('DOMContentLoaded', function() {
    const selectButton = document.getElementById('selectButton');
    const resultContainer = document.getElementById('result');
    const selectedNumbersContainer = document.getElementById('selectedNumbers');
    
    selectButton.addEventListener('click', async function() {
        // 버튼 비활성화 및 로딩 상태
        selectButton.disabled = true;
        selectButton.innerHTML = '<span class="loading-spinner me-2"></span>뽑는 중...';
        
        // SweetAlert2로 시작 알림
        await Swal.fire({
            title: '🎲 청소당번 뽑기!',
            text: '공정한 추첨을 진행하고 있습니다...',
            icon: 'info',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
        
        // 1부터 28까지의 숫자 배열 생성
        const numbers = [];
        for (let i = 1; i <= 28; i++) {
            numbers.push(i);
        }
        
        // Fisher-Yates 셔플 알고리즘을 사용하여 배열 섞기
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }
        
        // 첫 5개 선택
        const selectedNumbers = numbers.slice(0, 5).sort((a, b) => a - b);
        
        // 결과 표시
        await displayResults(selectedNumbers);
        
        // 버튼 원래 상태로 복구
        selectButton.disabled = false;
        selectButton.innerHTML = '<i class="fas fa-dice me-2"></i>다시 뽑기';
        
        // 결과 알림
        await Swal.fire({
            title: '🎉 청소당번이 선정되었습니다!',
            html: `
                <div class="text-center">
                    <p class="mb-3">이번 주 청소당번은:</p>
                    <div class="d-flex justify-content-center gap-2 flex-wrap">
                        ${selectedNumbers.map(num => `<span class="badge bg-danger fs-6 px-3 py-2">${num}번</span>`).join('')}
                    </div>
                    <p class="mt-3 text-muted small">모두 수고하세요! 💪</p>
                </div>
            `,
            icon: 'success',
            confirmButtonText: '확인',
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            },
            hideClass: {
                popup: 'animate__animated animate__bounceOut'
            }
        });
    });
    
    async function displayResults(numbers) {
        // 기존 결과 지우기
        selectedNumbersContainer.innerHTML = '';
        
        // 결과 컨테이너 표시 (Bootstrap의 d-none 클래스 제거)
        resultContainer.classList.remove('d-none');
        
        // 새로운 번호들을 하나씩 추가 (순차적 애니메이션)
        for (let i = 0; i < numbers.length; i++) {
            await new Promise(resolve => {
                setTimeout(() => {
                    const numberElement = document.createElement('div');
                    numberElement.classList.add('number-badge');
                    numberElement.textContent = numbers[i] + '번';
                    
                    // Bootstrap tooltip 추가
                    numberElement.setAttribute('data-bs-toggle', 'tooltip');
                    numberElement.setAttribute('data-bs-placement', 'top');
                    numberElement.setAttribute('title', `${numbers[i]}번 학생`);
                    
                    selectedNumbersContainer.appendChild(numberElement);
                    
                    // Bootstrap tooltip 초기화
                    new bootstrap.Tooltip(numberElement);
                    
                    resolve();
                }, 300);
            });
        }
    }
    
    // 페이지 로드 시 웰컴 메시지
    Swal.fire({
        title: '👋 청소당번 선택기에 오신 것을 환영합니다!',
        text: '공정하고 랜덤한 추첨으로 청소당번을 선정해드립니다.',
        icon: 'info',
        confirmButtonText: '시작하기',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
    });
});
