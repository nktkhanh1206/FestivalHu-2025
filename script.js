// Helper function for debounce
        function debounce(func, delay) {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }

        // Xử lý cuộn ngang cho các card (áp dụng cho Giới thiệu, Nghệ thuật, Lịch trình)
        document.querySelectorAll('.card-wrapper:not(.circular-gallery-wrapper):not(.village-scroll)').forEach(wrapper => {
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
        const modalImageContainer = document.getElementById("modalImageContainer");

        // Hàm để reset modal content
        function resetModalContent() {
            modalTitle.textContent = '';
            modalBody.innerHTML = '';
            modalImageContainer.innerHTML = ''; // Xóa ảnh khi đóng/mở modal mới
        }

        // Hàm để thêm nhiều ảnh vào modal
        function addImagesToModal(imageUrls, altText) {
            if (imageUrls) {
                const urls = imageUrls.split(','); // Tách chuỗi URL thành mảng
                urls.forEach(url => {
                    const imgElement = document.createElement('img');
                    imgElement.src = url.trim(); // Loại bỏ khoảng trắng thừa
                    imgElement.alt = altText;
                    modalImageContainer.appendChild(imgElement);
                });
            }
        }

        // For "read-more" links (Giới thiệu, Làng nghề, Nghệ thuật, Ẩm thực)
        document.querySelectorAll(".read-more").forEach(button => {
            button.addEventListener("click", function(event) {
                event.preventDefault(); // Prevent default link behavior
                resetModalContent(); // Reset content before opening

                const title = this.getAttribute("data-title");
                const content = this.getAttribute("data-content");
                // Lấy thuộc tính data-images thay vì data-image
                const imageUrls = this.getAttribute("data-images") || this.getAttribute("data-image"); 

                modalTitle.textContent = title;
                modalBody.textContent = content;

                addImagesToModal(imageUrls, title); // Gọi hàm mới để thêm ảnh
                
                modal.style.display = "flex"; // Use flex to center the modal
            });
        });

        // For Masonry cards (Điểm tham quan)
        document.querySelectorAll(".attraction-card").forEach(card => {
            card.addEventListener("click", function() {
                resetModalContent(); // Reset content before opening

                const title = this.getAttribute("data-title");
                const content = this.getAttribute("data-content");
                // Lấy thuộc tính data-images mới. Nếu không có, fallback về src của ảnh hiện tại.
                const imageUrls = this.getAttribute("data-images") || this.querySelector('.card-image img').src; 

                modalTitle.textContent = title;
                modalBody.textContent = content;

                addImagesToModal(imageUrls, title); // Gọi hàm mới để thêm ảnh

                modal.style.display = "flex";
            });
        });

        closeButton.addEventListener("click", function() {
            modal.style.display = "none";
            resetModalContent(); // Reset content when closing
        });

        // Close the modal when clicking outside of it
        window.addEventListener("click", function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                resetModalContent(); // Reset content when closing
            }
        });

        // Scroll buttons functionality (áp dụng cho Giới thiệu, Nghệ thuật, Lịch trình)
        document.querySelectorAll('.scroll-container:not(.circular-gallery-container):not(.village-scroll-container)').forEach(container => {
            const prevBtn = container.querySelector('.scroll-btn.prev');
            const nextBtn = container.querySelector('.scroll-btn.next');
            const cardWrapper = container.querySelector('.card-wrapper');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: -cardWrapper.clientWidth / 2, // Scroll half of the wrapper width
                        behavior: 'smooth'
                    });
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    cardWrapper.scrollBy({
                        left: cardWrapper.clientWidth / 2, // Scroll half of the wrapper width
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
            
            // Function to get current card width + gap dynamically
            const getCardScrollAmount = () => {
                const firstCard = cardWrapper.querySelector('.card');
                if (firstCard) {
                    const cardStyle = window.getComputedStyle(firstCard);
                    const cardWidth = firstCard.offsetWidth;
                    const gap = parseFloat(cardStyle.marginRight) || parseFloat(window.getComputedStyle(cardWrapper).gap);
                    return cardWidth + gap;
                }
                return 300; // Fallback value
            };

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const scrollAmount = getCardScrollAmount();
                    cardWrapper.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                    // Circular logic for previous button
                    if (cardWrapper.scrollLeft <= 0) {
                        setTimeout(() => {
                            cardWrapper.scrollLeft = cardWrapper.scrollWidth - cardWrapper.clientWidth;
                        }, 300);
                    }
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const scrollAmount = getCardScrollAmount();
                    cardWrapper.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                    // Circular logic for next button
                    if (cardWrapper.scrollLeft + cardWrapper.clientWidth >= cardWrapper.scrollWidth) {
                        setTimeout(() => {
                            cardWrapper.scrollLeft = 0;
                        }, 300);
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
                resetModalContent(); // Reset content before opening

                const month = this.getAttribute("data-month");
                const scheduleContent = this.getAttribute("data-schedule");
                // Lấy thuộc tính data-images mới. Nếu không có, fallback về src của ảnh hiện tại.
                const imageUrls = this.getAttribute("data-images") || this.querySelector('.card-image img').src; 

                modalTitle.textContent = "Lịch trình " + month;
                modalBody.innerHTML = scheduleContent; // Sử dụng innerHTML vì nội dung có thẻ HTML

                addImagesToModal(imageUrls, "Lịch trình " + month); // Gọi hàm mới để thêm ảnh

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

            cards.forEach((card, index) => {
                const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
                const wrapperCenter = scrollLeft + (wrapperWidth / 2);
                const distance = Math.abs(cardCenter - wrapperCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    targetIndex = index;
                }
            });

            cards.forEach((card, index) => {
                card.classList.toggle('centered', index === targetIndex);
            });
            
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
        
        // Apply centered card effect to "Làng nghề truyền thống" section
        const villageWrapper = document.querySelector('#village-cards');
        const villageScrollContainer = document.querySelector('.village-scroll-container');

        if (villageWrapper && villageScrollContainer) {
            villageWrapper.isDragging = false;
            
            villageWrapper.addEventListener('mousedown', () => {
                villageWrapper.isDragging = true;
            });
            
            villageWrapper.addEventListener('mouseup', () => {
                villageWrapper.isDragging = false;
                updateCenteredVillageCard(villageWrapper);
            });
            
            villageWrapper.addEventListener('scroll', debounce(() => {
                if (!villageWrapper.isDragging) {
                    updateCenteredVillageCard(villageWrapper);
                }
            }, 100)); // Debounce scroll event

            // Initial center on load
            setTimeout(() => {
                const initialCardIndex = 1; // Card "Làng đúc đồng Phường Đúc"
                const initialCard = villageWrapper.querySelectorAll('.card')[initialCardIndex];
                if (initialCard) {
                    const targetScrollLeft = initialCard.offsetLeft - (villageWrapper.clientWidth / 2) + (initialCard.offsetWidth / 2);
                    villageWrapper.scrollLeft = targetScrollLeft;
                    updateCenteredVillageCard(villageWrapper);
                }
            }, 100);

            // Update on window resize (to adjust for responsive changes)
            window.addEventListener('resize', debounce(() => {
                updateCenteredVillageCard(villageWrapper);
            }, 200)); // Debounce resize event

            // Add scroll button functionality for village section
            const villagePrevBtn = villageScrollContainer.querySelector('.scroll-btn.prev');
            const villageNextBtn = villageScrollContainer.querySelector('.scroll-btn.next');

            if (villagePrevBtn) {
                villagePrevBtn.addEventListener('click', () => {
                    villageWrapper.scrollBy({
                        left: -villageWrapper.clientWidth / 2, // Scroll half of the wrapper width
                        behavior: 'smooth'
                    });
                });
            }

            if (villageNextBtn) {
                villageNextBtn.addEventListener('click', () => {
                    villageWrapper.scrollBy({
                        left: villageWrapper.clientWidth / 2, // Scroll half of the wrapper width
                        behavior: 'smooth'
                    });
                });
            }
        }
