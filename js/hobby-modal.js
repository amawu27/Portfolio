// ===== HOBBIES MODAL SYSTEM =====
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('hobbyModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalGrid = document.getElementById('modalGrid');
    const modalTabs = document.getElementById('modalTabs');

    if (!modal || !modalClose || !modalTitle || !modalGrid) {
        console.warn('⚠️ Modal elements not found. Skipping hobby modal initialization.');
        return;
    }

    // Track current tab
    let currentHobby = 'gaming';
    let currentTab = 'moba';

    // Library data per hobby with categories
    const libraryData = {
        gaming: {
            title: 'My Game Library',
            icon: 'fa-gamepad',
            tabs: ['moba', 'fps', 'action'],
            items: {
                moba: [
                    { title: 'League of Legends', img: 'https://assets-prd.ignimgs.com/2021/12/14/leagueoflegends-1639513774570.jpg?crop=1%3A1%2Csmart&format=jpg&auto=webp&quality=80' },
                    { title: 'Mobile Legends', img: 'https://egw.news/_next/image?url=https%3A%2F%2Fegw.news%2Fuploads%2Fnews%2F1%2F17%2F1751354094029_1751354094029.webp&w=1920&q=75' },
                    { title: 'Wild Rift', img: 'https://sm.ign.com/ign_ap/cover/l/league-of-/league-of-legends-wild-rift_vmq4.jpg' },
                ],
                fps: [
                    { title: 'Valorant', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwjdhn2PAKSQXRuKbj1FH-Ox0krw8kunA2XxDI-uMpJhItG5haJpnBLbXi&s=10' },
                    { title: 'Crossfire', img: 'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/co2iie.jpg' },
                    { title: 'Call of Duty', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQvNoDFe9qLR41Zd9U_-N9CAJ2h5nJNU7fKri-Z4fGsL8NUxMhbatsziI&s=10' },
                ],
                action: [
                    { title: 'Grand Theft Auto', img: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/34724113-9c69-4c3e-a939-f6507c76f702/dgqa56v-25288944-f2e6-4d92-832c-61568e059943.png/v1/fill/w_1280,h_1707,q_80,strp/cover_of_gta_san_andreas_remastered_by_rainerdrakkar_dgqa56v-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTcwNyIsInBhdGgiOiIvZi8zNDcyNDExMy05YzY5LTRjM2UtYTkzOS1mNjUwN2M3NmY3MDIvZGdxYTU2di0yNTI4ODk0NC1mMmU2LTRkOTItODMyYy02MTU2OGUwNTk5NDMucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.QHXi3ZxQ8kz4UhQv5MHAG2bEv_3NvN2UI0lreqAauvQ' },
                    { title: 'Red Dead Redemption', img: 'https://preview.redd.it/which-cover-art-do-you-prefer-v0-2seiwn5rw1ka1.jpg?width=620&format=pjpg&auto=webp&s=8e32f28c4af7f47c6cf5c272836479b1321ecf5f' },
                    { title: 'Hogwarts Legacy', img: 'https://upload.wikimedia.org/wikipedia/en/f/fb/Hogwarts_legacyboxart.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Assassins Creed', img: 'https://upload.wikimedia.org/wikipedia/en/5/52/Assassin%27s_Creed.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Sleeping Dogs', img: 'https://upload.wikimedia.org/wikipedia/en/9/90/Sleeping_Dogs_-_Square_Enix_video_game_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Watch Dogs', img: 'https://static.wikia.nocookie.net/watchdogscombined/images/1/16/Watch_Dogs_Box_Art.png/revision/latest?cb=20230403162557' },
                    { title: 'Uncharted', img: 'https://cdn.mobygames.com/covers/10095064-uncharted-4-a-thiefs-end-playstation-4-front-cover.jpg' },
                    { title: 'Rise of the Tomb Raider', img: 'https://upload.wikimedia.org/wikipedia/en/2/29/Rise_of_the_Tomb_Raider.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Life is Strange', img: 'https://upload.wikimedia.org/wikipedia/en/0/0d/Life_Is_Strange_cover_art.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Mafia', img: 'https://i.redd.it/kj9blodjpmze1.jpeg' }
                ]
            }
        },
        music: {
            title: 'My Playlist',
            icon: 'fa-headphones',
            tabs: [],
            items: {
                default: [
                    { title: 'Fireflies', img: 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Owlcity_fireflies_cover.jpg/250px-Owlcity_fireflies_cover.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
                    { title: 'To The Sky', img: 'https://upload.wikimedia.org/wikipedia/en/7/75/To_the_Sky_Owl_City.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'When Can I See You Again', img: 'https://i1.sndcdn.com/artworks-000061700234-mfjc6r-t500x500.jpg' },
                    { title: 'Sunshine', img: 'https://i1.sndcdn.com/artworks-000349584285-33ctyl-t500x500.jpg' },
                    { title: 'Sunkissed', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmE4bEB2C-0SewlufPrzklJ5RTgZxVmk_S0hJonRe_6xcX6-Ci2UKT85fl&s=10' },
                    { title: 'Aphrodite', img: 'https://f4.bcbits.com/img/a3175401626_16.jpg' },
                    { title: 'DNA', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKdjn7u5VaD82-7C07hFAQuEcZkOUqu2FpvwczDKhTfg&s' },
                    { title: 'Pink Skies', img: 'https://i1.sndcdn.com/artworks-VnIxIa0ipFip-0-t500x500.jpg' },
                    { title: 'Sunroof', img: 'https://i.scdn.co/image/ab67616d0000b2731f9f426cc448de5118de3d7e' },
                    { title: 'La Da Dee', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRes0STkchONKgay_n6bQ1qPKopVzATiS57u2xTs6yYVg&s' }
                ]
            }
        },
        movies: {
            title: 'My Anime Collection',
            icon: 'fa-film',
            tabs: [],
            items: {
                default: [
                    { title: 'One Piece', img: 'https://static.wikia.nocookie.net/onepiece/images/c/c6/Volume_100.png/revision/latest?cb=20210903160940' },
                    { title: 'Sakamoto Days', img: 'https://static.wikia.nocookie.net/sakamoto-days/images/0/0f/Volume_01.png/revision/latest?cb=20210329150714' },
                    { title: 'Solo Leveling', img: 'https://m.media-amazon.com/images/I/811qwtjnRKL._AC_UF894,1000_QL80_.jpg' },
                    { title: 'Frieren', img: 'https://upload.wikimedia.org/wikipedia/en/6/60/Frieren_Beyond_Journey%27s_End.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Naruto', img: 'https://upload.wikimedia.org/wikipedia/en/9/94/NarutoCoverTankobon1.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'Daemons of the Shadow Realm', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4wJP1vMuIijMpzrzTWARTAHBr1Uk6e629HExHhVM7Z449Ds9TyZ1dEMI&s=10' },
                    { title: 'Black Clover', img: 'https://m.media-amazon.com/images/M/MV5BZmZkZjNhMWMtM2U0Mi00MjdlLTk3NmMtMTMwZjgwOTJmODMzXkEyXkFqcGc@._V1_.jpg' },
                    { title: 'Dandadan', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLaFqA7oKya-gDwdvxEJm2PX2RFQAlzbbHfcRcyr08-gUjSk0UOd7qkv8&s=10' },
                    { title: 'Gachiakuta', img: 'https://static.wikia.nocookie.net/gachiakuta/images/0/0f/Volume_01.png/revision/latest?cb=20220407171858' },
                    { title: 'Shangrila Frontier', img: 'https://m.media-amazon.com/images/M/MV5BNjdkOTE4NWItYWUyNS00ZTQ5LWE5ODYtODA1YWUxNThhY2E1XkEyXkFqcGc@._V1_.jpg' }
                ]
            }
        },
        tech: {
            title: 'Tech I Explore',
            icon: 'fa-laptop-code',
            tabs: [],
            items: {
                default: [
                    { title: 'Visual Studio Code', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoffYpdb9Xg0YztJA3tLe8-YliSZXxZX47lW_xOIZsnQ&s=10' },
                    { title: 'Eclipse', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0LqB_Ggnl4bwhgI63bpISbWIs6kItSZg0Jg3snROWKA&s=10' },
                    { title: 'Codeblocks', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2zHpY_Sa9VrY4WxmKobW-YySKHNC9-1NAQHD1ym3MEYzWZFQVjID5Gwc&s=10' },
                    { title: 'Netbeans', img: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Apache_NetBeans_Logo.svg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original' },
                    { title: 'GitHub', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbfWp6eBKxp7rRI9P3g4qVd5MtL0lHGtWsw4CMvAmGuA&s=10' },
                    { title: 'Android Studio', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Android_Studio_Logo_%282023%29.svg/1280px-Android_Studio_Logo_%282023%29.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail' },
                ]
            }
        }
    };

        // Function to render modal content
    function renderModal(hobby, tab) {
        const data = libraryData[hobby];
        if (!data) return;

        // Set title
        modalTitle.innerHTML = `<i class="fas ${data.icon}"></i> ${data.title}`;

        // Handle tabs
        if (data.tabs && data.tabs.length > 0) {
            modalTabs.style.display = 'flex';
            modalTabs.innerHTML = data.tabs.map(t => `
                <button class="modal-tab ${t === tab ? 'active' : ''}" data-tab="${t}">
                    ${t === 'moba' ? '⚔️ MOBA' : t === 'fps' ? '🔫 FPS' : '🎯 Action/Adventure'}
                </button>
            `).join('');

            modalTabs.querySelectorAll('.modal-tab').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const newTab = this.dataset.tab;
                    renderModal(hobby, newTab);
                });
            });
        } else {
            modalTabs.style.display = 'none';
        }

        // Get items
        let items = [];
        if (data.tabs && data.tabs.length > 0) {
            items = data.items[tab] || data.items[data.tabs[0]] || [];
        } else {
            items = data.items.default || [];
        }

        // Build grid
        modalGrid.innerHTML = items.map(item => `
            <div class="modal-item">
                <img src="${item.img}" alt="${item.title}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%231a1d26%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2220%22 fill=%22%23666%22 text-anchor=%22middle%22 dy=%22.3em%22%3E📷%3C/text%3E%3C/svg%3E'">
                <div class="modal-item-title">${item.title}</div>
            </div>
        `).join('');

        // Reset scroll to top when changing tabs
        if (modalBody) {
            modalBody.scrollTop = 0;
        }
    }

    // Open modal
    document.querySelectorAll('.hobby-card[data-modal]').forEach(card => {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const hobby = this.dataset.modal;
            const data = libraryData[hobby];
            if (!data) {
                console.warn(`⚠️ No data found for hobby: ${hobby}`);
                return;
            }

            currentHobby = hobby;
            currentTab = (data.tabs && data.tabs.length > 0) ? data.tabs[0] : 'default';

            renderModal(hobby, currentTab);
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    console.log('✅ Hobby Modal System loaded.');
});