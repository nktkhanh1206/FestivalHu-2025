// 1. Hiệu ứng Loading Screen
        window.addEventListener('load', () => {
            const loader = document.getElementById('loader');
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.add('loaded'); // Kích hoạt fade-in cho body
            }, 800); // Thời gian chờ để loader biến mất
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainMenu = document.getElementById('mainMenu');
        
        mobileMenuBtn.addEventListener('click', () => {
            mainMenu.classList.toggle('active');
        });
        
        // Page navigation
        const navLinks = document.querySelectorAll('[data-page]');
        const pages = document.querySelectorAll('.page');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetPageId = link.getAttribute('data-page');
                
                // Update active nav link
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
                
                // Show selected page with animation
                pages.forEach(page => {
                    page.classList.remove('active');
                    page.style.opacity = 0;
                    page.style.transform = 'translateY(20px)';
                });
                const targetPage = document.getElementById(targetPageId);
                targetPage.classList.add('active');
                targetPage.style.opacity = 1;
                targetPage.style.transform = 'translateY(0)';

                // Hide all seasonal timelines and detail sections when navigating to a main page
                document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                    section.classList.remove('active');
                });

                // Kích hoạt animation cho nội dung hero của trang mới
                const heroContent = targetPage.querySelector('.hero');
                if (heroContent) {
                    heroContent.classList.remove('show-content'); // Reset animation
                    setTimeout(() => {
                        heroContent.classList.add('show-content');
                    }, 100); // Small delay to re-trigger animation
                }

                // Kích hoạt animation cho các phần tử khác trên trang mới
                revealElementsOnPage(targetPage);
                
                // Close mobile menu if open
                mainMenu.classList.remove('active');
                
                // Scroll to top
                window.scrollTo(0, 0);
            });
        });
        
        // Form submission
        const contactForm = document.getElementById('contactForm');
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send the form data to a server
            // For this demo, we'll just show an alert
            alert(`Cảm ơn ${name} đã liên hệ! Chúng tôi sẽ phản hồi qua email ${email} về chủ đề ${subject} trong thời gian sớm nhất.`);
            
            // Reset form
            contactForm.reset();
        });
        
        // Responsive adjustments for timeline
        function adjustTimeline() {
            const timeline = document.querySelector('.timeline');
            const timelineItems = document.querySelectorAll('.timeline-item');
            
            // Remove all positioning classes first to reset
            timelineItems.forEach(item => {
                item.classList.remove('left', 'right');
            });
            
            if (window.innerWidth > 992) {
                // Desktop view: alternate left and right
                timelineItems.forEach((item, index) => {
                    if (index % 2 === 0) {
                        item.classList.add('left');
                    } else {
                        item.classList.add('right');
                    }
                });
                // Ensure the main timeline bar is centered for desktop
                if (timeline) { // Kiểm tra timeline có tồn tại không
                    const timelineAfter = timeline.querySelector('.timeline::after');
                    if (timelineAfter) {
                        timelineAfter.style.left = '50%';
                        timelineAfter.style.transform = 'translateX(-50%)';
                    }
                }
            } else {
                // Mobile view: all items are left-aligned
                // The media query in CSS handles the left alignment and width for mobile
                // Ensure the main timeline bar is left-aligned for mobile
                if (timeline) { // Kiểm tra timeline có tồn tại không
                    const timelineAfter = timeline.querySelector('.timeline::after');
                    if (timelineAfter) {
                        timelineAfter.style.left = '31px';
                        timelineAfter.style.transform = 'translateX(0)';
                    }
                }
            }
        }
        
        // Initial adjustment
        adjustTimeline();
        
        // Adjust on window resize
        window.addEventListener('resize', adjustTimeline);

        // 2. Hiệu ứng Parallax cho Hero Section
        function applyParallax() {
            const heroSections = document.querySelectorAll('.hero');
            heroSections.forEach(hero => {
                const parallaxBg = hero.querySelector('.hero-bg-parallax');
                if (parallaxBg) {
                    const rect = hero.getBoundingClientRect();
                    const scrollPosition = window.pageYOffset;
                    const heroTop = rect.top + scrollPosition;
                    const heroHeight = rect.height;

                    // Tính toán vị trí di chuyển của background
                    // Di chuyển background chậm hơn scroll
                    let yPos = (scrollPosition - heroTop) * 0.3; 
                    parallaxBg.style.transform = `translateY(${yPos}px)`;
                }
            });
        }

        // 3. Animation khi cuộn (Scroll Reveal)
        const scrollRevealElements = document.querySelectorAll(
            '.section-title, .about-image, .about-text, .card, .pricing-card, .contact-form, .form-group'
        );

        const observerOptions = {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0.1 // Khi 10% phần tử hiển thị trong viewport
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    // Nếu là form-group, thêm delay cho từng cái
                    if (entry.target.classList.contains('form-group')) {
                        const formGroups = Array.from(document.querySelectorAll('.form-group'));
                        const index = formGroups.indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                    observer.unobserve(entry.target); // Dừng quan sát sau khi đã hiện
                }
            });
        }, observerOptions);

        scrollRevealElements.forEach(el => {
            observer.observe(el);
        });

        // 4. Hiệu ứng Timeline động (kết hợp với Scroll Reveal)
        // This needs to be re-initialized for each seasonal timeline
        function initTimelineObservers(timelineContainer) {
            const timelineItems = timelineContainer.querySelectorAll('.timeline-item');
            const timelineObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = Array.from(timelineItems).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.15}s`; // Delay cho từng item
                        entry.target.classList.add('show');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 }); // Ngưỡng cao hơn để kích hoạt sớm hơn

            timelineItems.forEach(item => {
                timelineObserver.observe(item);
            });
        }

        // Hàm để kích hoạt lại animation khi chuyển trang
        function revealElementsOnPage(pageElement) {
            // Kích hoạt hero content
            const heroContent = pageElement.querySelector('.hero');
            if (heroContent) {
                heroContent.classList.remove('show-content');
                setTimeout(() => {
                    heroContent.classList.add('show-content');
                }, 100);
            }

            // Kích hoạt section titles
            pageElement.querySelectorAll('.section-title').forEach(el => {
                el.classList.remove('show');
                setTimeout(() => { el.classList.add('show'); }, 100);
            });

            // Kích hoạt about content
            pageElement.querySelectorAll('.about-image, .about-text').forEach(el => {
                el.classList.remove('show');
                setTimeout(() => { el.classList.add('show'); }, 100);
            });

            // Kích hoạt cards
            pageElement.querySelectorAll('.card, .pricing-card').forEach((el, index) => {
                el.classList.remove('show');
                setTimeout(() => { el.classList.add('show'); }, 100 + index * 50); // Delay nhẹ cho từng card
            });

            // Kích hoạt contact form và form groups
            const contactForm = pageElement.querySelector('.contact-form');
            if (contactForm) {
                contactForm.classList.remove('show');
                setTimeout(() => { contactForm.classList.add('show'); }, 100);
                contactForm.querySelectorAll('.form-group').forEach((el, index) => {
                    el.classList.remove('show');
                    el.style.transitionDelay = `${index * 0.1}s`;
                    setTimeout(() => { el.classList.add('show'); }, 200);
                });
            }
        }

        // Gọi hàm revealElementsOnPage cho trang chủ khi tải lần đầu
        revealElementsOnPage(document.getElementById('home'));

        // Lắng nghe sự kiện cuộn để áp dụng parallax
        window.addEventListener('scroll', applyParallax);
        // Gọi lần đầu để thiết lập vị trí ban đầu
        applyParallax();

        // Hiệu ứng thu nhỏ header khi cuộn
        const header = document.querySelector('header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // 5. Hiệu ứng Phóng to thông tin khi di chuyển chuột (Card Hover Effect)
        const cards = document.querySelectorAll('.card, .pricing-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // Vị trí X của chuột trong card
                const y = e.clientY - rect.top;  // Vị trí Y của chuột trong card

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 15; // Điều chỉnh độ nghiêng theo Y
                const rotateY = (centerX - x) / 15; // Điều chỉnh độ nghiêng theo X

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            });
        });

        // New JavaScript for seasonal timeline and detail sections
        document.addEventListener('DOMContentLoaded', () => {
            const schedulePage = document.getElementById('schedule');
            const attractionsPage = document.getElementById('attractions');

            // Handle "Xem chi tiết" buttons for seasonal timelines
            document.querySelectorAll('.view-season-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const season = e.target.dataset.season;
                    
                    // Hide all seasonal timeline sections
                    document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                        section.classList.remove('active');
                    });

                    // Show the target seasonal timeline
                    const targetTimeline = document.getElementById(`${season}-timeline`);
                    if (targetTimeline) {
                        targetTimeline.classList.add('active');
                        targetTimeline.style.opacity = 1;
                        targetTimeline.style.transform = 'translateY(0)';
                        initTimelineObservers(targetTimeline); // Re-initialize observer for new timeline
                        window.scrollTo(0, targetTimeline.offsetTop - 100); // Scroll to section
                    }
                });
            });

            // Handle "Xem chi tiết" buttons for attraction details
            document.querySelectorAll('.view-detail-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const detailTarget = e.target.dataset.detailTarget;
                    
                    // Hide all main content sections on attractions page
                    attractionsPage.querySelectorAll('.section-title, .card-container').forEach(el => {
                        el.style.display = 'none';
                    });

                    // Hide all detail sections
                    document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                        section.classList.remove('active');
                    });

                    // Show the target detail section
                    const targetDetail = document.getElementById(`${detailTarget}-detail`);
                    if (targetDetail) {
                        targetDetail.classList.add('active');
                        targetDetail.style.opacity = 1;
                        targetDetail.style.transform = 'translateY(0)';
                        revealElementsOnPage(targetDetail); // Trigger animations for detail content
                        window.scrollTo(0, targetDetail.offsetTop - 100); // Scroll to section
                    }
                });
            });

            // Handle "Quay lại Khám phá Huế" buttons
            document.querySelectorAll('.back-to-attractions').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Hide all detail sections
                    document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                        section.classList.remove('active');
                    });

                    // Show all main content sections on attractions page
                    attractionsPage.querySelectorAll('.section-title, .card-container').forEach(el => {
                        el.style.display = 'grid'; // Or 'block' depending on original display
                        el.classList.remove('show'); // Reset show class for re-animation
                    });
                    revealElementsOnPage(attractionsPage); // Re-trigger animations for main sections
                    window.scrollTo(0, 0); // Scroll to top of attractions page
                });
            });

            // Special handling for home page "Xem lịch trình" button to show schedule page and spring timeline
            document.querySelector('.hero .btn[data-page="schedule"]').addEventListener('click', (e) => {
                e.preventDefault();
                const targetPageId = e.target.dataset.page;
                
                // Simulate navigation to schedule page
                navLinks.forEach(navLink => {
                    navLink.classList.remove('active');
                });
                document.querySelector(`[data-page="${targetPageId}"]`).classList.add('active');
                
                pages.forEach(page => {
                    page.classList.remove('active');
                    page.style.opacity = 0;
                    page.style.transform = 'translateY(20px)';
                });
                const targetPage = document.getElementById(targetPageId);
                targetPage.classList.add('active');
                targetPage.style.opacity = 1;
                targetPage.style.transform = 'translateY(0)';

                // Hide all seasonal timeline sections first
                document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                    section.classList.remove('active');
                });

                // Show Spring timeline by default
                const springTimeline = document.getElementById('spring-timeline');
                if (springTimeline) {
                    springTimeline.classList.add('active');
                    springTimeline.style.opacity = 1;
                    springTimeline.style.transform = 'translateY(0)';
                    initTimelineObservers(springTimeline);
                    window.scrollTo(0, springTimeline.offsetTop - 100);
                }
                revealElementsOnPage(targetPage);
                mainMenu.classList.remove('active');
            });

            // Handle "Sự kiện nổi bật" buttons on home page to navigate to schedule and specific season
            document.querySelectorAll('#home .card .btn[data-page="schedule"]').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const season = e.target.dataset.season;
                    const targetPageId = e.target.dataset.page;

                    // Simulate navigation to schedule page
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    document.querySelector(`[data-page="${targetPageId}"]`).classList.add('active');
                    
                    pages.forEach(page => {
                        page.classList.remove('active');
                        page.style.opacity = 0;
                        page.style.transform = 'translateY(20px)';
                    });
                    const targetPage = document.getElementById(targetPageId);
                    targetPage.classList.add('active');
                    targetPage.style.opacity = 1;
                    targetPage.style.transform = 'translateY(0)';

                    // Hide all seasonal timeline sections first
                    document.querySelectorAll('.seasonal-timeline-section').forEach(section => {
                        section.classList.remove('active');
                    });

                    // Show the specific seasonal timeline
                    const targetTimeline = document.getElementById(`${season}-timeline`);
                    if (targetTimeline) {
                        targetTimeline.classList.add('active');
                        targetTimeline.style.opacity = 1;
                        targetTimeline.style.transform = 'translateY(0)';
                        initTimelineObservers(targetTimeline);
                        window.scrollTo(0, targetTimeline.offsetTop - 100);
                    }
                    revealElementsOnPage(targetPage);
                    mainMenu.classList.remove('active');
                });
            });
        });
