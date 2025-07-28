// Xử lý cuộn ngang cho các card (áp dụng cho Giới thiệu, Nghệ thuật, Lịch trình)
        // Loại bỏ phần Làng nghề khỏi đây để quản lý cuộn riêng
        document.querySelectorAll('.card-wrapper:not(.circular-gallery-wrapper):not(.village-scroll)').forEach(wrapper => { // Cập nhật selector
            let isDown = false;
            let startX;
            let scrollLeft;

            wrapper.addEventListener('mousedown', (e) => {
                isDown = true;
                wrapper.classList.add('active');
                startX = e.pageX - wrapper.offsetLeft;
                scrollLeft = wrapper.scrollLeft;
            });

            wrapper.addEventListener('mouseleave', () => {
                isDown = false;
                wrapper.classList.remove('active');
            });

            wrapper.addEventListener('mouseup', () => {
                isDown = false;
                wrapper.classList.remove('active');
            });

            wrapper.addEventListener('mousemove', (e) => {
                if(!isDown) return;
                e.preventDefault();
                const x = e.pageX - wrapper.offsetLeft;
                const walk = (x - startX) * 2;
                wrapper.scrollLeft = scrollLeft - walk;
            });
        });

        // Modal functionality
        const modal = document.getElementById("myModal");
        const closeButton = document.querySelector(".close-button");
        const modalTitle = document.getElementById("modalTitle");
        const modalBody = document.getElementById("modalBody");

        // For "read-more" links (Giới thiệu, Làng nghề, Nghệ thuật)
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                const title = this.getAttribute("data-title");
                const content = this.getAttribute("data-content");

                modalTitle.textContent = title;
                modalBody.textContent = content;
                modal.style.display = "flex"; // Use flex to center the modal
            });
        });

        // For Masonry cards (Điểm tham quan)
        document.querySelectorAll(".attraction-card").forEach(card => {
            card.addEventListener("click", function() {
                const title = this.getAttribute("data-title");
                const content = this.getAttribute("data-content");

                modalTitle.textContent = title;
                modalBody.textContent = content;
                modal.style.display = "flex";
            });
        });


        closeButton.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Close the modal when clicking outside of it
        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        // Scroll buttons functionality (áp dụng cho Giới thiệu, Nghệ thuật, Lịch trình)
        // Loại bỏ phần Làng nghề khỏi đây để quản lý cuộn riêng
        document.querySelectorAll('.scroll-container:not(.circular-gallery-container):not(.village-scroll-container)').forEach(container => { // Cập nhật selector
            const prevBtn = container.querySelector('.scroll-btn.prev');
            const nextBtn = container.querySelector('.scroll-btn.next');
            const cardWrapper = container.querySelector('.card-wrapper');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: -300, // Adjust scroll amount as needed
                        behavior: 'smooth'
                    });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: 300, // Adjust scroll amount as needed
                        behavior: 'smooth'
                    });
                });
            }
        });

        // Scroll buttons functionality for Circular Gallery (Ẩm thực)
        document.querySelectorAll('.circular-gallery-container').forEach(container => {
            const prevBtn = container.querySelector('.scroll-btn.prev');
            const nextBtn = container.querySelector('.scroll-btn.next');
            const cardWrapper = container.querySelector('.circular-gallery-wrapper');
            // Calculate card width + gap. Assuming 1rem = 16px. card min-width is 280px, gap is 1.5rem (24px)
            const cardWidth = 280 + (1.5 * 16); 

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: -cardWidth, // Scroll back one card
                        behavior: 'smooth'
                    });
                    // Circular logic for previous button
                    // If scrolled past the beginning, jump to the end
                    if (cardWrapper.scrollLeft <= 0) {
                        // A small timeout to allow smooth scroll to complete before jumping
                        setTimeout(() => {
                            cardWrapper.scrollLeft = cardWrapper.scrollWidth - cardWrapper.clientWidth;
                        }, 300); // Match this with your smooth scroll duration
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: cardWidth, // Scroll forward one card
                        behavior: 'smooth'
                    });
                    // Circular logic for next button
                    // If scrolled past the end, jump to the beginning
                    if (cardWrapper.scrollLeft + cardWrapper.clientWidth >= cardWrapper.scrollWidth) {
                        // A small timeout to allow smooth scroll to complete before jumping
                        setTimeout(() => {
                            cardWrapper.scrollLeft = 0;
                        }, 300); // Match this with your smooth scroll duration
                    }
                });
            }
        });

        // New: Intersection Observer for fade-in-up effect on attraction cards
        const attractionCards = document.querySelectorAll('#attraction-section .card');

        const observerOptions = {
            root: null, // Use the viewport as the root
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the item is visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        }, observerOptions);

        attractionCards.forEach(card => {
            observer.observe(card);
        });

        // For Schedule cards (Lịch trình)
        document.querySelectorAll(".schedule-card").forEach(card => {
            card.addEventListener("click", function() {
                const month = this.getAttribute("data-month");
                const scheduleContent = this.getAttribute("data-schedule");

                modalTitle.textContent = "Lịch trình " + month;
                modalBody.innerHTML = scheduleContent; // Sử dụng innerHTML vì nội dung có thẻ HTML
                modal.style.display = "flex";
            });
        });

        // Improved centered card function with snapping for village-scroll
        function updateCenteredVillageCard(wrapper) {
            const cards = wrapper.querySelectorAll('.card');
            const scrollLeft = wrapper.scrollLeft;
            const wrapperWidth = wrapper.clientWidth;
            
            let targetIndex = 0;
            let minDistance = Infinity;

            // Tìm card gần trung tâm nhất trong viewport của wrapper
            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                const wrapperCenter = scrollLeft + (wrapperWidth / 2);
                const distance = Math.abs(cardCenter - wrapperCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    targetIndex = index;
                }
            });

            // Cập nhật lớp 'centered'
            cards.forEach((card, index) => {
                card.classList.toggle('centered', index === targetIndex);
            });
            
            // Cuộn đến card trung tâm nếu không đang kéo
            if (!wrapper.isDragging) {
                const targetCard = cards[targetIndex];
                if (targetCard) {
                    const targetScrollLeft = targetCard.offsetLeft - (wrapperWidth / 2) + (targetCard.offsetWidth / 2);
                    wrapper.scrollTo({
                        left: targetScrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        }
        
        // Track dragging state for smoother UX
        let isDragging = false;

        // Apply centered card effect to "Làng nghề truyền thống" section
        const villageWrapper = document.querySelector('#village-cards');
        const villageScrollContainer = document.querySelector('.village-scroll-container'); // Lấy container chứa nút

        if (villageWrapper && villageScrollContainer) {
            // Track drag state for better UX
            villageWrapper.isDragging = false;
            
            villageWrapper.addEventListener('mousedown', () => {
                villageWrapper.isDragging = true;
            });
            
            villageWrapper.addEventListener('mouseup', () => {
                villageWrapper.isDragging = false;
                updateCenteredVillageCard(villageWrapper);
            });
            
            villageWrapper.addEventListener('scroll', () => {
                if (!villageWrapper.isDragging) {
                    // Thêm debounce để tránh gọi quá nhiều lần khi cuộn
                    clearTimeout(villageWrapper.scrollTimeout);
                    villageWrapper.scrollTimeout = setTimeout(() => {
                        updateCenteredVillageCard(villageWrapper);
                    }, 100); // Chờ 100ms sau khi dừng cuộn
                }
            });
            
            // Initial center on load
            setTimeout(() => {
                // Cuộn đến card thứ 2 (index 1) để nó ở giữa khi tải trang
                const initialCardIndex = 1; // Card "Làng đúc đồng Phường Đúc"
                const initialCard = villageWrapper.querySelectorAll('.card')[initialCardIndex];
                if (initialCard) {
                    const targetScrollLeft = initialCard.offsetLeft - (villageWrapper.clientWidth / 2) + (initialCard.offsetWidth / 2);
                    villageWrapper.scrollLeft = targetScrollLeft;
                    updateCenteredVillageCard(villageWrapper);
                }
            }, 100);

            // Update on window resize (to adjust for responsive changes)
            window.addEventListener('resize', () => {
                updateCenteredVillageCard(villageWrapper);
            });

            // Add scroll button functionality for village section
            const villagePrevBtn = villageScrollContainer.querySelector('.scroll-btn.prev');
            const villageNextBtn = villageScrollContainer.querySelector('.scroll-btn.next');

            if (villagePrevBtn) {
                villagePrevBtn.addEventListener('click', () => {
                    villageWrapper.scrollBy({
                        left: -300, // Adjust scroll amount as needed
                        behavior: 'smooth'
                    });
                });
            }

            if (villageNextBtn) {
                villageNextBtn.addEventListener('click', () => {
                    villageWrapper.scrollBy({
                        left: 300, // Adjust scroll amount as needed
                        behavior: 'smooth'
                    });
                });
            }
        }
